var Files = [],
    FileNames = [],
    TrackIndex = 0,
    AlbumArt = "../assets/icon_128.png";

var SelectSong = function() {
  TrackIndex = FileNames.indexOf(this.innerHTML);
  LoadSong();
};

var LoadSong = function() {
  var audioplayer = document.getElementById("audio_player"),
      audiosource = document.getElementById("mp3_src");

  audiosource.src = Files[TrackIndex];
  audioplayer.pause();
  audioplayer.load();
  audioplayer.play();
  $("ul li").removeClass("playing");
  $("li").eq(TrackIndex).addClass("playing");
  
  chrome.notifications.create('nowplaying', {
    type: 'basic',
    iconUrl: AlbumArt,
    title: FileNames[TrackIndex],
    message: FileNames[TrackIndex]
  }, function(notificationId){});
};

var GetNextTrack = function() {
  if (TrackIndex < Files.length) {
    TrackIndex++;
    LoadSong();
  }
};

var ClearFiles = function() {
  var audioplayer = document.getElementById("audio_player"),
      albumart = document.getElementById("album_art");

  $("#audio_player").unbind("ended", GetNextTrack);
  audioplayer.pause();
  for (i = 0; i < Files.length; ++i) {
    URL.revokeObjectURL(Files[i]);
  }
  $("#folder_select").val('');
  $("ul").empty();
  albumart.src = '';
  Files = [];
  FileNames = [];
  AlbumArt = "../assets/icon_128.png";
  TrackIndex = 0;
};

var GetFiles = function() {
  if (window.File && window.FileReader && window.FileList && window.Blob) { }
  else {
    alert("This browser cannot support this upload method");
    return;
  }
  var selectedfolder = document.getElementById("folder_select"),
      files = selectedfolder.files,
      audioplayer = document.getElementById("audio_player"),
      audiosource = document.getElementById("mp3_src"),
      songlist = document.getElementById("song_list"),
      albumart = document.getElementById("album_art");

  for (i = 0; i < files.length; i++) {
    if (files[i].type == "audio/mp3") {
      Files.push(URL.createObjectURL(files[i]));
      FileNames.push(files[i].name);
  
      var li = document.createElement('li');
      li.innerHTML = files[i].name;
      songlist.appendChild(li);
      li.onclick = SelectSong;
    } else if (files[i].name == "AlbumArtSmall.jpg") {
      AlbumArt =  URL.createObjectURL(files[i]);
    }
  }

  albumart.src = AlbumArt;
  LoadSong();
  $("#audio_player").on("ended", GetNextTrack);
};

$(function () {
  $("#folder_select").change(GetFiles);
  $("#clear_files").click(ClearFiles);
});