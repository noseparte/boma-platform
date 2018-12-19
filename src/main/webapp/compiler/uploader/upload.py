#coding:utf-8
import os, sys
import re
import time

son_dir = ''
if len(sys.argv) > 1:
	son_dir = sys.argv[1] + '/'

def getCurrentFiles(ext):
	li = []
	for root, dirs, files in os.walk(son_dir):
		for fn in files:
			if os.path.splitext(fn)[1] != ext:
				continue
			path = os.path.join(root, fn)
			path = path.lstrip(r'.\/')
			if son_dir:
				path = re.compile(son_dir).sub('', path)
			li.append(path)
	return li

def file_copy(srcfile, desfile):
	desfile = os.path.abspath(desfile)
	f1 = open(srcfile, 'rb')
	f2 = open(desfile, 'wb')

	line = f1.read()
	f2.write(line)

def _postFile(file, bpath):
	file_read = son_dir + file
	if len(open(file_read).read()) == 0:
		print file + ' is empty'
		return ''
	# a little confused
	index = file.rfind('\\')
	if index > 0:
		bpath += file[:index] + '/'
	bpath = re.compile(r'//').sub('/', bpath)

	# 设置文件名
	newname = file.split('\\')[-1] #过滤目录
	if re.compile('_(\d{6})(\w*)').findall(newname):
		newname = _postFileCheck(bpath, newname)
	# 复制文件
	file_copy(son_dir + file, bpath + newname)
	os.remove(son_dir + file)
	print '---------------generate' + os.path.abspath(bpath + newname) + ' success---------------'

def _postFileCheck(bpath, file):
	filePath = bpath + file
	
	def newname(m):
		newnames = 'abcdefghigklmnopqrstuvwxyz'
		newname = m.group(2)
		index = newnames.find(newname)
		if newname and index != -1:
			newname = newnames[index + 1]
		else:
			newname = newnames[0]
		return '_' + m.group(1) + newname
		# if exist in js direction increase version
	if os.path.exists(filePath):
		file = re.compile(r''.join('_(\d{6})([a-zA-Z]*)')).sub(newname,file)
		return _postFileCheck(bpath, file)
	return file
		
def postFiles(jsfileli):
	for jsfile in jsfileli:
		bpath = '../js/'
		_postFile(jsfile, bpath)

if __name__ == '__main__':
	jsli = getCurrentFiles('.js')
	if jsli:
		print 'js file list:'
		for ele in jsli:
			print ele
	print '--------------generating files--------------'
	postFiles(jsli)
	time.sleep(2)