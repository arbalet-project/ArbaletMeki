#!/usr/bin/env python
# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

setup(
    name='arbalet_stjean',
    version='0.0.0',
    license="GNU General Public License 3",
    description="Arbalet St Jean",
    url='http://github.com/arbalet-project',
    author="Yoan Mollard",
    author_email="contact@arbalet-project.org",
    long_description="Arbalet St Jean",

    install_requires= ["zmq", "numpy", "flask", "flask_cors", "petname"],
    include_package_data=True,
    zip_safe=False,  # contains data files

    classifiers=[
        "Programming Language :: Python",
        "Development Status :: 2 - Pre-Alpha",
        "Natural Language :: English",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Topic :: Games/Entertainment",
    ],

    data_files=[('arbalet/stjean/snap/templates', ['arbalet/stjean/snap/templates/admin.html']),
                ('arbalet/stjean/config', ['arbalet/stjean/config/config.json']),
                ('arbalet/stjean/snap/static/js/lib', ['arbalet/stjean/snap/static/js/lib/jquery-3.2.1.js']),
    ],

    packages=find_packages(),
    namespace_packages = ['arbalet', 'arbalet.stjean']
)
