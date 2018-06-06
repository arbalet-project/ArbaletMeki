from .model import Model
from .simulator import Simulator
from threading import Thread
from struct import pack
from time import sleep
from artnet import dmx
from os import path
import socket
import sys
import json


class Wall(Thread):
    PROTOCOL_VERSION = 1

    def __init__(self, hardware_ip, hardware_port, hardware=True, simulator=True):
        Thread.__init__(self)
        self.header = list(map(ord, ['A', 'R', 'B', 'A'])) + [self.PROTOCOL_VERSION]
        self.model = Model(15, 20)
        self.ip = hardware_ip
        self.port = hardware_port

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
                for row in range(self.model.height):
                    for col in range(self.model.width):
                        r, g, b = map(lambda x: min(255, max(0, int(x*255))), self.model[row][col])
                        num_pixel = self.config['mapping'][row][col]
                        packet = [num_pixel, r, g, b]
                        self.socket.sendto(bytes(self.header + packet), (self.ip, self.port))

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


