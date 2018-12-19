#!/usr/bin/python
# coding: utf-8
#from httpproxy2 import HttpProxy2
import os,sys
import shutil
import glob
import time
import re
import string

reload(sys)
sys.setdefaultencoding("utf8")

#打包JS（新增的目录及子目录请预先makedir设置一下，并在发布系统上确保目录是否存在，上传脚本只负责创建本地目录，不负责创建发布系统中的目录）
def pack(file):
    makedir('./lib')
    makedir('./module')
    makedir('./util')
    makedir('./page')
    #Page
    if file == 'page/index':
        op=os.popen('java -jar compiler.jar --charset=utf-8 --js=../js/util/jquery.tmpl.min.js --js=../js/module/TreeList.js --js=../js/page/index.js --warning_level=QUIET --js_output_file=./page/index.js')
        return 'page/index.js'
    if file == 'page/login':
        op=os.popen('java -jar compiler.jar --charset=utf-8 --js=../js/page/login.js --warning_level=QUIET --js_output_file=./page/login.js')
        return 'page/login.js'
#打包模块版本号
def packVersion (file):
    #获取模块版本号
    url = 'http://t.qq.com/t'
    http = HttpProxy2(host="t.qq.com",cookie='')
    versionModel = ''
    try:
        versionModel = re.findall(r'MIVersion=[^;(]+', http.do_get(url,{}), re.M)[0][10:99999]
        if versionModel:
            f1 = open(file,'rb')
            line = f1.read()
            #替换文件中的版本号
            line = re.compile(r'versionSet\(\{[^;]+').sub('versionSet(' + versionModel.decode('gb2312').encode('UTF-8') + ')',line)
            f2 = open(file,'wb')
            f2.write(line)
    except:
        print 'version model fail'

#发布
def publish(files):
    fileList = {}
    file = ''
    apid = ''
    global na
    incre = False
    print '------------packing files(' + time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time())) + ')----------'
    for file in files:
        if file:
            # not auto upload
            if file == 'na':
                na = True
                continue
            if file == 'apid':
                apid = True
                continue
            if na == True:
                tmpVer = ''
                defVer[file] = tmpVer
            fileList[file] = pack(file)
            if na == True:
                defVer[fileList[file]] = defVer[file]
            print fileList[file]
    versionJS()
    #versionCSS()
    paths = './'
    # 获取绝对路径
    path = os.path.abspath(paths)
    leng = len(path) + 1
    for root, dirs, files in os.walk(paths):
        if root.find('.svn') != -1:#过滤文件夹
            continue
         # 遍历文件夹
        for fn in files:
            # 拼接文件路径
            full_path = os.path.join(root, fn)
            # 获取上传文件夹中对应的路径
            path = os.path.abspath(root)
            rel_path = 'uploader/' + path[leng:]
            abs_path = os.path.abspath(rel_path)
            #是否在文件列表中
            isInFileList = False
            for file in fileList:
            	#for windows
            	#if fileList[file] and re.compile(r'^\./').sub(r'', re.compile(r'_\d{6}').sub(r'', full_path)) == re.compile(r'/').sub(r'\\', re.compile(r'_\d{6}').sub(r'', fileList[file])):
                if fileList[file] and re.compile(r'^\./').sub(r'', re.compile(r'_\d{6}').sub(r'', full_path)) == re.compile(r'_\d{6}').sub(r'', fileList[file]):
                    isInFileList = True
            if isInFileList:
                #拷贝
                if not len(rel_path):#根文件夹直接拷贝
                    file_copy(full_path, abs_path)
                else:
                    if not os.path.exists(abs_path):#文件夹不存在，先建一个
                        os.mkdir(abs_path)
                    file_copy(full_path, abs_path)
    #os.system('notepad ./uploader/log.txt')
    print '-----------------------pack success---------------------'
    if na == False:
        os.system('python ./uploader/upload.py uploader')#系统调用，上传脚本

#转码
def convert(filename,in_enc = "gb2312",out_enc="UTF-8"):
    # read the file
    content = open(filename).read()
    # convert the concent
    try:
        new_content = content.decode(in_enc).encode(out_enc)
        #write to file
        open(filename,'w').write(new_content)
    except:
        print " error... "
#加零
def addZero(str):
    if len(str) < 2:
        str = '0' + str
    return str

#复制文件
def file_copy(srcfile, desdir):
    filename = os.path.basename(srcfile)
    filepath = os.path.join(desdir,filename)
    f1 = open(srcfile,'rb')
    f2 = open(filepath,'wb')

    line = f1.read()
    f2.write(line)

#压缩CSS
def compress_copy(srcfile, desdir):
    filename = os.path.basename(srcfile)
    filename = filename[0:-4] + '_' + version + '.css'
    filepath = os.path.join(desdir,filename)
    f1 = open(srcfile,'rb')
    f2 = open(filepath,'wb')

    line = f1.read()
    regIndex = 0
    newLine = line

    #找出代码中@import的子模块
    importCsss = re.findall(r"@import url([^;]*);?", newLine, re.M)
    if importCsss:
        mainFilePath = re.compile(r'_\d{1,7}').sub('',filepath)
        mergers[mainFilePath] = []
        filePathArray = re.split("\\\\", filepath)[0:-1]
        for importCss in importCsss:
            parentPathNum = len(re.findall(r"\.\./", importCss[2:-2], re.M)) #父级路径长度
            if parentPathNum:
                parentPath = filePathArray[0:-parentPathNum]
            else:
                parentPath = filePathArray
            fileName = re.compile(r'\.\./').sub('',importCss[2:-2]) #删掉../
            fileName = re.compile(r'\./').sub('',fileName) #删掉./
            filePathRight = "\\".join(parentPath) + '\\' + fileName
            mergers[mainFilePath].append(filePathRight)
        mergers[mainFilePath].append(mainFilePath) #主文件放在最后面
        #print mergers

    for j in reg_css:
        image = re.compile(r''.join(j))
        newLine = image.sub(regTo_css[regIndex],newLine)
        regIndex = regIndex + 1
    if line != '':
        f2.write(newLine)

    """
    for line in f1:
        regIndex = 0
        newLine = line
        for j in reg:
            image = re.compile(r''.join(j))
            newLine = image.sub(regTo[regIndex],newLine)
            regIndex = regIndex + 1
        if line != '':
            f2.write(newLine)
    """
#复制
def copy_ext_files(ext, paths):
    """paths:原始文件的目录
        ext：特定后缀名过滤
                    从目标文件夹下拷贝特定后缀名的文件，拷贝到本目录下，保留原始文件结构
    """
    path = os.path.abspath(paths)
    leng = len(path) + 1
    for root, dirs, files in os.walk(paths):
        for fn in files:
            if os.path.splitext(fn)[1] != ext:#非指定后缀过滤
                continue
            full_path = os.path.join(root, fn)
            path = os.path.abspath(root)
            rel_path = path[leng:]
            abs_path = os.path.abspath(rel_path)
            if not len(rel_path):#根文件夹直接拷贝
                compress_copy(full_path,'.')
            else:
                if not os.path.exists(abs_path):#文件夹不存在，先建一个
                    os.mkdir(abs_path)
                compress_copy(full_path,abs_path)

#样式文件合并
def merge_ext_files():
    for merger in mergers:
        cssFile = merger
        cssFileName = cssFile[0:-4] + '_' + version + '.css' #目标文件名
        cssFiles = mergers[merger]
        cssFilesContent = ''

        #遍历要合并的文件
        index = 0
        for f in cssFiles:
            cssFilesName = f[0:-4] + '_' + version + '.css' #目标文件名
            cssFileContent = open(cssFilesName).read()
            if index == len(cssFiles) - 1: #过滤掉子文件的版本号
                cssFileContent = re.compile(r''.join('(\/\*(\s|.)*?\*\/)|\r|\n|\t')).sub('',cssFileContent)
            try:
                cssFilesContent += cssFileContent
            except:
                print " css file error... " + cssFilesName
            #os.remove(cssFilesName)
            index += 1

        #写入
        open(cssFileName,'w').write(cssFilesContent)

#创建目录
def makedir(pathname):
    if pathname.find('uploader') == -1:
        makedir('./uploader/' + pathname[2:]);
    abs_path = os.path.abspath(pathname)
    if not os.path.exists(abs_path):
        os.mkdir(abs_path)

#设置CSS版本号
def versionCSS():
    #需要合并的CSS
    mergers = {
        #微博阅读 http://read.t.qq.com
        #'./read/style.css' : ['./read/style.css','./read/base.css','./read/style.main.css','./read/style.ie.css','./read/skin1.css']
    }

    if __name__ == "__main__":
        path = u"../css" #css的目录
        copy_ext_files('.css', path)
        merge_ext_files()
        #特殊处理一下style.api.css，不需要版本号
        #open('style.api.css','w').write(open('style.api_' + version + '.css').read())
        #os.remove('style.api_' + version + '.css')

#设置JS版本号
def versionJS():
    find_files('.js','./')


#压缩JS
def write_file(i, fn):
    global na
    f, ext = os.path.splitext(i)
    if len(i.split('_1')) > 1:
        return
    localtime = time.localtime()
    date = str(localtime[0])[2 : 4] + addZero(str(localtime[1])) + addZero(str(localtime[2]))
    if na == True:
        filename = f + defVer[fn] + ext
    else:
        filename = f + '_' + date + ext
    file = open(i, 'r')
    content =  file.readlines()
    strcontent = ''
    filecontent = []
    for k in content:
        regIndex = 0
        new = k
        for j in reg_js:
            image = re.compile(r''.join(j))
            if new.find('in', -5, -1) > 0:
                print '';
            else:
                new = image.sub(regTo_js[regIndex], new)
                regIndex = regIndex + 1
        if k != '':
            filecontent.append(new)

    strcontent = "".join(filecontent)
    #print filename
    file = open(filename, 'w').write(strcontent)
    os.remove(i)

#查找目录
def find_files(ext, paths):
    path = os.path.abspath(paths)
    leng = len(path) + 1
    newFn = ''
    for root, dirs, files in os.walk(paths):
        if root.find('.svn') != -1:#去掉svn文件夹中的文件
            continue
        for fn in files:
            if os.path.splitext(fn)[1] != ext:#非指定后缀过滤
                continue
            full_path = os.path.join(root, fn)
            path = os.path.abspath(root)
            rel_path = path[leng:]
            abs_path = os.path.abspath(rel_path)
            if rel_path.split('\\')[0] == 'uploader':
                continue
            if na == True:
                newFn = re.compile(r'\./').sub('', root)
                newFn = re.compile(r'\\').sub('/', newFn)
                if newFn != '':
                    newFn = newFn + '/' + fn
                else:
                    newFn = fn
            write_file(full_path, newFn)


#日期版本号
version = ''
#合并文件的索引
mergers = {}
#CSS冗余代码过滤
reg_css = ['(\/\*(\s|.)*?\*\/)|\r|\n|\t','[\s]+','[\s]{0,9},[\s]{0,9}','[\s]{0,9}:[\s]{0,9}','[\s]{0,9};[\s]{0,9}','[\s]{0,9}{[\s]{0,9}','[;]{0,9}}[\s]{0,9}','[\s]0px','[:]0px','[^{}]+{}','@import url([^;]*);?']#,'}'
regTo_css = ['',' ',',',':',';','{','}',' 0',':0','','']#,'}\r\n'
#JS冗余代码过滤
reg_js = ['(\/\*(\s|.)*?\*\/)|\r|\n|\t|\\\\t\\\\t']
regTo_js = ['']
#是否不自动上传文件(默认为False)
na = False
#在不自动上传时自定义版本号
defVer = {}

#SVN版本号
#svn_version = ""
#svn_path = "http://bj-scm.tencent.com/web/web_qqnews_rep/QQNews_Web_proj/trunk/Web_module_for_client/Wap/mx/"
#svn_exe = "svn.exe"
#svn_command = "info " + svn_path
#svn_info = os.popen('"%s" %s'%(svn_exe,svn_command)).readlines()
#if svn_info:
#    svn_version = '/*version:' + svn_info[7].split(':')[1].strip() + '*/'

#版本号
localtime = time.localtime()
date = str(localtime[0])[2:4] + addZero(str(localtime[1])) + addZero(str(localtime[2]))
version = date

#删掉临时的目录
Dir = './'
paths = os.listdir( Dir )
for path in paths:
    filePath = os.path.join( Dir, path )
    if os.path.isdir( filePath ):
        if filePath !=  Dir + 'uploader':
            shutil.rmtree(filePath,True)

#删掉根目录JS/CSS文件
dir = glob.glob(r"*.css")
for i in dir:
    #print i
    try:
        os.remove(i)
    except:
        print " remove error... "
dir = glob.glob(r"*.js")
for i in dir:
    try:
        os.remove(i)
    except:
        print " remove error... "
