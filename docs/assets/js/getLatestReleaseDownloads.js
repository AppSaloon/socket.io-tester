function GetLatestReleaseDownloads() {
  $.getJSON("https://api.github.com/repos/appsaloon/socket.io-tester/releases/latest").done(function(release) {
    var asset = release.assets[0];
    var downloadBaseUrl = asset.browser_download_url.substr(0, 1 + asset.browser_download_url.lastIndexOf('/'));
    var OSName, downloads;
    if (window.navigator.userAgent.indexOf("Windows") != -1) {
      OSName = "Windows";
      downloads = {
        x32: "socket-io-tester-win32-ia32.zip",
        x64: "socket-io-tester-win32-x64.zip"
      };
    }
    else if (window.navigator.userAgent.indexOf("Mac") != -1) {
      OSName = "OSX";
      downloads = {
        x64: "socket-io-tester-darwin-x64.zip"
      };
    }
    else if (window.navigator.userAgent.indexOf("Linux") != -1) {
      OSName = "Linux";
      downloads = {
        x32: "socket-io-tester-linux-ia32.zip",
        x64: "socket-io-tester-linux-x64.zip",
        ARMv7: "socket-io-tester-linux-armv7l.zip"
      };
    }

    if (OSName) {

      for(var architecture in downloads) {
        var url = downloadBaseUrl.concat(downloads[architecture]);
        var button = $("<button></button>");
        button.addClass('download');
        button.css({marginLeft: '5px'});
        var anchor = $("<a>");
        anchor.attr("href", url);
        anchor.text('DOWNLOAD FOR ' + OSName + '('+ architecture +')');
        anchor.appendTo(button)
        button.appendTo("#latest-release-download")
      }
    } else {

    }

    $("#latest-release-download").css({display: "block"});
  });
}