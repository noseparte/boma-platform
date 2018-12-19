#!/usr/bin/python
# coding: utf-8
execfile(r'_common.pyw');
import os, sys
files = [x for x in sys.argv if x.find('.pyw') == -1]
publish(files);