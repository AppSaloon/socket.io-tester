function GetLatestReleaseDownloads () {
  console.log('latest release: ', window.latest_release.tag)
  var downloadBaseUrl = window.latest_release.download_url
  var OSName, downloads
  if (window.navigator.userAgent.indexOf('Windows') != -1) {
    OSName = 'Windows'
    downloads = {
      x32: '/socket-io-tester-win32-ia32.zip',
      x64: '/socket-io-tester-win32-x64.zip'
    }
  }
  else if (window.navigator.userAgent.indexOf('Mac') != -1) {
    OSName = 'OSX'
    downloads = {
      x64: '/socket-io-tester-darwin-x64.zip'
    }
  }
  else if (window.navigator.userAgent.indexOf('Linux') != -1) {
    OSName = 'Linux'
    downloads = {
      x32: '/socket-io-tester-linux-ia32.zip',
      x64: '/socket-io-tester-linux-x64.zip',
      ARMv7: '/socket-io-tester-linux-armv7l.zip'
    }
  }

  if (OSName) {

    for (var architecture in downloads) {
      var url = downloadBaseUrl.concat(downloads[architecture])
      var button = $('<button></button>')
      button.addClass('download')
      var anchor = $('<a>')
      anchor.attr('href', url)
      anchor.text('DOWNLOAD FOR ' + OSName + '(' + architecture + ')')
      anchor.appendTo(button)
      button.appendTo('#latest-release-download')
    }
  } else {
    var unavailableDiv = $('<div></div>')
    var unavailableText = $('<p></p>')
    unavailableText.text('No download for ' + OSName || 'Unknown Operating System' + '.')
    unavailableText.appendTo(unavailableDiv)
    var latestRelease = $('<a>')
    latestRelease.attr('href', 'https://github.com/AppSaloon/socket.io-tester/releases/latest/')
    latestRelease.text('View available downloads on Github.')
    latestRelease.appendTo(unavailableDiv)
    unavailableDiv.appendTo('#latest-release-download')
  }
}