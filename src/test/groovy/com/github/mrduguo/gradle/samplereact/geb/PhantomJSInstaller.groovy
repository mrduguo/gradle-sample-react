package com.github.mrduguo.gradle.samplereact.geb

import org.openqa.selenium.Dimension
import org.openqa.selenium.Platform
import org.openqa.selenium.WebDriver
import org.openqa.selenium.phantomjs.PhantomJSDriver

class PhantomJSInstaller {

    private static String phantomJSVersion = System.properties.phantomJSVersion?:'2.1.1'

    static WebDriver usePhantomJS() {
        installPhantomJSIfNotInstalled()

        def phantomJSDriver = new PhantomJSDriver()
        phantomJSDriver.manage().window().setSize(new Dimension(1028, 768))
        return phantomJSDriver
    }

    static def installPhantomJSIfNotInstalled() {
        if (System.properties['phantomjs.binary.path']) {
            return
        }

        String platform
        String archiveExtension
        String execFilePath

        if (Platform.current.is(Platform.WINDOWS)) {
            execFilePath = 'phantomjs.exe'
            platform = 'windows'
            archiveExtension = 'zip'
        } else if (Platform.current.is(Platform.MAC)) {
            execFilePath = '/bin/phantomjs'
            platform = 'macosx'
            archiveExtension = 'zip'
        } else if (Platform.current.is(Platform.LINUX)) {
            execFilePath = '/bin/phantomjs'
            platform = 'linux-i686'
            archiveExtension = 'tar.bz2'
        } else {
            throw new RuntimeException("Unsupported operating system [${Platform.current}]")
        }

        String phantomjsExecPath = "phantomjs-${phantomJSVersion}-${platform}/${execFilePath}"

        String phantomJsFullDownloadPath = "https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-${phantomJSVersion}-${platform}.${archiveExtension}"

        File phantomJSDriverLocalFile = downloadDriver(phantomJsFullDownloadPath, phantomjsExecPath, archiveExtension)

        System.setProperty('phantomjs.binary.path', phantomJSDriverLocalFile.absolutePath)
    }

    private
    static File downloadDriver(String driverDownloadFullPath, String driverFilePath, String archiveFileExtension) {
        File destinationDirectory = new File(System.properties['user.home'],".phantomjs/drivers")
        if (!destinationDirectory.exists()) {
            destinationDirectory.mkdirs()
        }

        File driverFile = new File("${destinationDirectory.absolutePath}/${driverFilePath}")

        String localArchivePath = "./driver.${archiveFileExtension}"

        if (!driverFile.exists()) {
            def ant = new AntBuilder()
            ant.get(src: driverDownloadFullPath, dest: localArchivePath)

            if (archiveFileExtension == "zip") {
                ant.unzip(src: localArchivePath, dest: destinationDirectory)
            } else {
                ant.untar(src: localArchivePath, dest: destinationDirectory, compression: 'bzip2')
            }

            ant.delete(file: localArchivePath)
            ant.chmod(file: driverFile, perm: '700')
        }

        return driverFile
    }
}