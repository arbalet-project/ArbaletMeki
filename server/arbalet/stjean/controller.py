from .model import Model
from .simulator import Simulator
from threading import Thread
from struct import pack
from time import sleep
from artnet import dmx
from os import path
import struct
import socket
import sys
import json


class Wall(Thread):
    PROTOCOL_VERSION = 2
    PROTOCOL_RECEIVE_FRAME = b'F'
    PROTOCOL_SEND_DISCOVERY = b'H'
    NUM_PIXELS_PER_DGRAM = 150

    def __init__(self, hardware_ip, hardware_port, hardware=True, simulator=True):
        Thread.__init__(self)
        self.header = bytes(list(map(ord, ['A', 'R', 'B', 'A'])) + [self.PROTOCOL_VERSION]) + self.PROTOCOL_RECEIVE_FRAME
        self.model = Model(15, 20)
        self.ip = hardware_ip
        self.port = hardware_port
        self.num_pixels = self.model.height * self.model.width

        # row, column -> (DMX universe, DMX address)
        config_path = path.join(path.dirname(__file__), 'config', 'config.json')
        with open(config_path) as f:
            self.config = json.load(f)

        self.socket = None
        self.simulator = None
        self.rate = int(self.config['refresh_rate'])

        if simulator:
            self.simulator = Simulator(self.model)

        if hardware:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    def __getitem__(self, row):
        return self.model.__getitem__(row)

    def __setitem__(self, key, value):
        with self.model:
            self.model.__setitem__(key, value)

    def set_all(self, r, g, b):
        for row in range(self.model.height):
            for col in range(self.model.width):
                self.model[row, col] = r, g, b

    def update(self):
        if self.socket is not None:
            with self.model:
                frame = [[0]*3*self.NUM_PIXELS_PER_DGRAM for subframe in range(int(self.num_pixels / self.NUM_PIXELS_PER_DGRAM))]
                for row in range(self.model.height):
                    for col in range(self.model.width):
                        num_pixel = self.config['mapping'][row][col]
                        subframe_id = int(num_pixel / self.NUM_PIXELS_PER_DGRAM)
                        num_pixel_in_subframe = int(num_pixel % self.NUM_PIXELS_PER_DGRAM)
                        r, g, b = map(lambda x: min(255, max(0, int(x))), self.model[row][col])
                        frame[subframe_id][num_pixel_in_subframe*3] = r
                        frame[subframe_id][num_pixel_in_subframe*3+1] = g
                        frame[subframe_id][num_pixel_in_subframe*3+2] = b

                for subframe_id, subframe in enumerate(frame):
                    packet = bytes([subframe_id]) + bytes(subframe)
                    self.socket.sendto(self.header + packet, (self.ip, self.port))

        if self.simulator is not None:
            self.simulator.update() 


    def run(self):
        self.running = True
        try:
            while self.running:
                self.update()
                sleep(1./self.rate)
        finally:
            self.close()

    def close(self):
        self.running = None
        if self.socket is not None:
            self.socket.close()
        if self.simulator is not None:
            self.simulator.close()


