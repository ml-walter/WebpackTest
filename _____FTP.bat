:: author milkmidi
:: update 2016 05 10
set FILE_ZILLA="C:\Program Files\FileZilla FTP Client\filezilla.exe"
set IP=220.128.166.83
set USER_ID=
set PWD=
set REMOTE_PATH="/bizdev.medialand.com.tw/milkmidi/viewport"
%FILE_ZILLA% "ftp://%USER_ID%:%PWD%@%IP%%REMOTE_PATH%" --local="%cd%"
close

