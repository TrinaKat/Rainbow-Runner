// Music

function playMarioMusic()
{
  if ( isInvincible )
  {
      document.getElementById('themeSong').pause();
      document.getElementById('funSong').pause();
      document.getElementById('rainbowRoad').pause();
      document.getElementById('starSong').play();
  }
  else if ( !isMusic )
  {
      document.getElementById('themeSong').pause();
      document.getElementById('funSong').pause();
      document.getElementById('rainbowRoad').pause();
      document.getElementById('starSong').pause();
  }
  else if( isMusic && !isInvincible && !isFun )
  {
      document.getElementById('themeSong').play();
      document.getElementById('funSong').pause();
      document.getElementById('rainbowRoad').pause();
      document.getElementById('starSong').pause();
  }
  else if ( isMusic && !isInvincible && isFun )
  {
      document.getElementById('themeSong').pause();
      document.getElementById('funSong').play();
      document.getElementById('rainbowRoad').pause();
      document.getElementById('starSong').pause();
  }
}

function playRegularMusic()
{
  if ( isMusic && !isFun )
  {
      document.getElementById('themeSong').pause();
      document.getElementById('funSong').pause();
      document.getElementById('rainbowRoad').play();
      document.getElementById('starSong').pause();
  }
  else if ( !isMusic )
  {
      document.getElementById('themeSong').pause();
      document.getElementById('funSong').pause();
      document.getElementById('rainbowRoad').pause();
      document.getElementById('starSong').pause();
  }
  else if ( isMusic && isFun )
  {
      document.getElementById('themeSong').pause();
      document.getElementById('funSong').play();
      document.getElementById('rainbowRoad').pause();
      document.getElementById('starSong').pause();
  }
}

function stopInvincibilityMusic()
{
  document.getElementById('starSong').pause();
  if( isMusic )
  {
      if( isFun )
      {
          document.getElementById('funSong').play();
      }
      else if( isMarioMode )
      {
          document.getElementById('themeSong').play();
      }
      else
      {
          document.getElementById('rainbowRoad').play();
      }
  }
}

function playCubeCrashMusic()
{
  document.getElementById('crashSound').currentTime = 0;
  document.getElementById('crashSound').play();
  explodeSound = true;
}
