#!/bin/bash
time LINK="mold -run g++" CC="ccache gcc" CXX="ccache g++" lo build.js $@
