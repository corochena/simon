$(document).ready(function() {
  
  var historyRec = [];
  var userRec = [];
  var rounds = 0;
  var path = "https://s3.amazonaws.com/freecodecamp/simonSound";
  var strictMode = false;
  var avanzar = true;
  
  var colores = {
    green: ["green", "#66ff66"], 
    red: ["#800000", "#ff9980"], 
    blue: ["#222288", "#66ccff"], 
    yellow: ["#cca300", "yellow"], 
  };
  
  var sonidos = {
    green: new Audio(path + "1.mp3"),
    red: new Audio(path + "2.mp3"),
    blue: new Audio(path + "3.mp3"),
    yellow: new Audio(path + "4.mp3")
  }
  
  $('#start').on('click', function() {
    // iniciar el juego
    rounds = 0;
    historyRec = [];
    $('.led').html('00');
    avanzar = true;
    computerTurn(true);
  });
  
  $('#strict').on('click', function() {
    $(this).css('background-color', strictMode ? 'darkolivegreen' : 'lime');
    strictMode = !strictMode;
  });
  
  function computerTurn() {
    $('.led').html(rounds < 10 ? '0' + rounds : rounds);
    $('.color').off('click');
    $('.color').css('cursor', 'default');
    
    var i = 0; // para iterar en el array historyRec
    var timer = setInterval(function() {
      if (historyRec.length > 0) {
        media(historyRec[i]);
        i++;
      }
      if (i == historyRec.length) {
        // desactiva el timer cuando llega al final del array history
        // y agrega un nuevo color al array history
        setTimeout(function() {
          if (avanzar) {
            var newColor = Object.keys(colores)[Math.floor(4*Math.random())];
            media(newColor);
            historyRec.push(newColor);
          }
          clearInterval(timer);
        }, 700); // este tiempo debe ser menor al del setInterval !!!
        userRec = [];
        userTurn();
      }
    }, 800); // este tiempo debe ser mayor al del setTimeout !!!
  }
  
  function userTurn() {
    var tries = 0;
    
    // attach event listener to color divs
    $('.color').css('cursor', 'pointer');
    $('.color').on('click', function(e) {
      var colorName = $(e.currentTarget).prop("id");
      media(colorName);
      userRec.push(colorName);
      tries++;
      
      if (!compare(historyRec.slice(0, tries), userRec)) {
        $('.led').html('##');
        $('.color').off('click');
        $('.color').css('cursor', 'default');
        
        if (strictMode) {
          rounds = 0;
          historyRec = [];
        }

        avanzar = strictMode;
          
        setTimeout(computerTurn, 500);
        return;
      }
        
      if (tries == historyRec.length) {
        rounds++;    
        $('.led').html(rounds < 10 ? '0' + rounds : rounds);
        
        if (tries == 7) {
          setTimeout(function() {
            alert("ganaste");
          }, 1000);
          return;
        }
        
        // console.log(userRec);
        avanzar = true;
        setTimeout(computerTurn, 500);
      } 
    });
  }
  
  function compare(arrayA, arrayB) {
    if (arrayA.length != arrayB.length) return false;
    for (var i=0; i < arrayA.length; i++)
      if (arrayA[i] != arrayB[i]) return false;

    return true;
  }
  
  function media(colorName) {
    // simula encender un color y tocar un sonido
    $('#' + colorName).css("background-color", colores[colorName][1]);
    sonidos[colorName].play();
    
    setTimeout(function() {
      $('#' + colorName).css('background-color', colores[colorName][0]);
    }, 300);
  }
});


/*
    ERROR: enciende los colores al mismo tiempo
    history.forEach(function(color) {
      setTimeout(function() {
        $('#' + color).click();
      }, 500);
    });
    /*

    /*
    PRUEBA: enciende un color random cada seg 
    setInterval(function() {
      $('#' + Object.keys(colores)[Math.floor(4*Math.random())]).click();
    }, 1000);
    */