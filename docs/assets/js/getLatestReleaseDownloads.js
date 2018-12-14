function GetLatestReleaseDownloads () {
  console.info('latest release: ', window.latest_release.tag)
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
    if(window.screenshots[OSName]) {
      $('#screenshot').attr("src", window.screenshots[OSName]);
      $('#screenshot-big').attr("href", window.screenshots[OSName]);
    }
    for (var architecture in downloads) {
      var url = downloadBaseUrl.concat(downloads[architecture]);
      var button = $(`<button data-url="${url}"><a href="javascript: void(0);">DOWNLOAD FOR ${OSName} (${architecture})</a></button>`);
      button.on('click', function(event) {
        window.open(event.currentTarget.dataset.url, 'Download');
      });
      button.addClass('download');
      button.appendTo('#latest-release-download');
    }
    var versionString = $('<p></p>');
    versionString.addClass('version-string');
    versionString.text('The latest version is ' + window.latest_release.tag);
    versionString.appendTo('.center-wrapper');
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