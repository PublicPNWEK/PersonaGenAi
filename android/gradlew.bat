@ECHO OFF
SET DIR=%~dp0
IF EXIST "%DIR%gradle\wrapper\gradle-wrapper.jar" GOTO wrapper
ECHO gradle-wrapper.jar missing. Run "gradle wrapper" inside the android\ directory.
EXIT /B 1
:wrapper
IF "%JAVA_HOME%"=="" (
  SET JAVA_EXE=java
) ELSE (
  SET JAVA_EXE="%JAVA_HOME%\bin\java.exe"
)
"%JAVA_EXE%" -jar "%DIR%gradle\wrapper\gradle-wrapper.jar" %*
