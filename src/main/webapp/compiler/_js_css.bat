@echo off
title 腾讯新闻客户端打包上传工具
echo 腾讯新闻客户端打包上传工具
echo.
echo -----------------------------------------------------------------------------
echo -1,文件名规则使用“路径+文件名”规则，默认不带.js;
echo -2,CSS默认不带.css（除非与JS重名）;
echo -3,新增的请到_common.pyw中配置（注意用空格缩进）;
echo -4,example:page/roseLive module/Tvp roselive/style
echo -5,如果不使用自动上传，在参数前加na(not auto upload),example:na page/roseLive
echo -----------------------------------------------------------------------------
echo.
:start
set file=
set /p file=请输入文件名（多个文件之间用空格分隔）:
rem 开启Fiddler代理会影响文件上传
for /f "tokens=3 delims= " %%i in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable') do (
    if "%%i" equ "0x1" (
        reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f >nul
        echo 已停止代理
    )
)

python _js_css.pyw %file%

for /f "tokens=3 delims= " %%i in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable') do (
    if "%%i" equ "0x0" (
        reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f >nul
        echo 已启用代理
    )
)
echo.
echo.
goto start
pause