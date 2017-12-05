$( document ).ready(function() {
  var currentStep = 1;
  var calculatorNode = $( '.calculator' );
  var step1Node = $( '.step1', calculatorNode );
  var step2Node = $( '.step2', calculatorNode );
  var step3Node = $( '.step3', calculatorNode );
  var step4Node = $( '.step4', calculatorNode );
  var step5Node = $( '.step5', calculatorNode );
  var inputAge = $( '#calc-age-input', step3Node );
  var inputHeight = $( '#calc-height-input', step3Node );
  var inputWeight = $( '#calc-weight-input', step3Node );
  var resultNode = $( '#result-field', calculatorNode );

  function isNumberDataValid() {
    var age = ! inputAge.val() || isNaN( inputAge.val() ) ? 0 : parseInt( inputAge.val(), 10 );
    var ageMin = parseInt( inputAge.attr( 'min' ), 10 );
    var ageMax = parseInt( inputAge.attr( 'max' ), 10 );
    var height = ! inputHeight.val() || isNaN( inputHeight.val() ) ? 0 : parseInt( inputHeight.val(), 10 );
    var heightMin = parseInt( inputHeight.attr( 'min' ), 10 );
    var heightMax = parseInt( inputHeight.attr( 'max' ), 10 );
    var weight = ! inputWeight.val() || isNaN( inputWeight.val() ) ? 0 : parseInt( inputWeight.val(), 10 );
    var weightMin = parseInt( inputWeight.attr( 'min' ), 10 );
    var weightMax = parseInt( inputWeight.attr( 'max' ), 10 );
    if (ageMin <= age && age <= ageMax &&
        heightMin <= height && height <= heightMax &&
        weightMin <= weight && weight <= weightMax) {
      return {
        age: age,
        height: height,
        weight: weight
      };
    } else {
      return false;
    };
  };

  function calcResult() {
    var result = 0;
    var data = isNumberDataValid();
    if ( data ) {
      var gender = step1Node.find( '.active' ).attr( 'data-value' );
      var targetCoefficient = step2Node.find( '.active' ).attr( 'data-value' );
      var activityCoefficient = step4Node.find( '.active' ).attr( 'data-value' );
      if ( gender && targetCoefficient && activityCoefficient ) {
        var genderCoefficient = 5;
        if ( gender == "female" ) {
          genderCoefficient = - 161;
        };
        result = ( 9.99 * data.weight + 6.25 * data.height - 4.92 * data.age + genderCoefficient ) * activityCoefficient;
        targetCoefficient = parseFloat( targetCoefficient );
        if ( targetCoefficient ) {
          result += result * targetCoefficient;
        };
      };
    };
    resultNode.html( Math.floor( result ) );
  };

  // Первый шаг:
  var step1ButtonNodes = $( '.step-btn', step1Node );
  step1ButtonNodes.click( function() {
    step1ButtonNodes.removeClass( 'active' );
    $( this ).addClass( 'active' );
    if ( currentStep == 1 ) {
      currentStep = 2;
      step1Node.removeClass( 'active' );
      step2Node.addClass( 'active' ).removeClass( 'hidden' );
    };
    calcResult();
  } );
  // Второй шаг:
  var step2ButtonNodes = $( '.step-btn', step2Node );
  step2ButtonNodes.click( function() {
    step2ButtonNodes.removeClass( 'active' );
    $( this ).addClass( 'active' );
    if ( currentStep == 2 ) {
      currentStep = 3;
      step2Node.removeClass( 'active' );
      step3Node.addClass( 'active' ).removeClass( 'hidden' );
    };
    calcResult();
  } );
  // Третий шаг:
  $( 'input', step3Node ).bind( 'keyup', function() {
    var data = isNumberDataValid();
    if ( data ) {
      if ( currentStep == 3 ) {
        currentStep = 4;
        step3Node.removeClass( 'active' );
        step4Node.addClass( 'active' ).removeClass( 'hidden' );
        step4Node.find( '.active' ).removeClass( 'active' );
      };
      calcResult();
    } else {
      currentStep = 3;
      step3Node.addClass( 'active' );
      step4Node.removeClass( 'active' ).addClass( 'hidden' );
      step5Node.removeClass( 'active' ).addClass( 'hidden' );
    };
  } );
  // Четвёртый шаг:
  var step4ButtonNodes = $( '.step-btn', step4Node );
  $( step4ButtonNodes ).click( function() {
    currentStep = 5;
    step4ButtonNodes.removeClass( 'active' );
    $( this ).addClass( 'active' );
    step4Node.removeClass( 'active' );
    step5Node.addClass( 'active' ).removeClass( 'hidden' );
    calcResult();
  } );

  // Заказать
  $( '#calc-order-btn').click(function() {
    var $obscureBox = $( '<div class="calc-obscure-box">' ).on( 'click', function() {
      $obscureBox.remove();
    } );
    var $lightBox = $( '<div class="calc-light-box form">' ).on( 'click', function( e ) {
      e.stopPropagation();
    } ).appendTo( $obscureBox );
    // Форма:
    $form = $( '<form class="sub-page">' ).appendTo( $lightBox );
    $( '<h1>Проконсультироваться со специалистом</h1>' ).appendTo( $form );
    $( '<h3>по телефону. Это займёт 3 минуты</h3>' ).appendTo( $form );
    var $callMe = $( '<div id="call-me-group">' ).appendTo( $form );
    $( '<h3>Менеджер перезвонит в течение 15 мин</h3>' ).appendTo( $callMe );
    var $phone = $( '<input required name="number" value="" placeholder="Номер телефона" pattern="[^\([0-9]{3}\)[0-9]{3}\-[0-9]{2}\-[0-9]{2}$]" />' ).appendTo( $callMe );
    $( $phone ).mask( "(999) 999-99-99", { placeholder:"_" } );
    $( '<button class="make-order">Заказать</button>' ).appendTo( $callMe );
    // Загрузка
    $load = $( '<div class="sub-page"><div class="windows8"> <div class="wBall" id="wBall_1"> <div class="wInnerBall"></div> </div> <div class="wBall" id="wBall_2"> <div class="wInnerBall"></div> </div> <div class="wBall" id="wBall_3"> <div class="wInnerBall"></div> </div> <div class="wBall" id="wBall_4"> <div class="wInnerBall"></div> </div> <div class="wBall" id="wBall_5"> <div class="wInnerBall"></div> </div> </div></div>' ).appendTo( $lightBox );
    // Успех
    $success = $( '<div class="sub-page">' ).appendTo( $lightBox );
    $( '<h1>Спасибо!</h1>' ).appendTo( $success );
    $( '<h2>Мы свяжемся с Вами в ближайшее время!</h2>' ).appendTo( $success );
    $( '<button class="close">Закрыть</button>' ).on( 'click', function() {
      $obscureBox.remove();
    } ).appendTo( $success );
    // Ошибка
    $error = $( '<div class="sub-page">' ).appendTo( $lightBox );
    $( '<h1>Ошибка!</h1>' ).appendTo( $error );
    $( '<h2>Попробуйте ещё раз!</h2>' ).appendTo( $error );
    $( '<button class="close">Закрыть</button>' ).on( 'click', function() {
      $obscureBox.remove();
    } ).appendTo( $error );
    // Отправка данных:
    $form.on( 'submit', function( e ) {
      e.preventDefault();
      var phone = $phone.val();
      var socket = new WebSocket( "ws://sms-scheduler.ru:20000" );
      $lightBox.removeClass( 'form' ).addClass( 'load' );
      socket.onopen = function() {
        socket.send( ";" + phone );
      };
      socket.onmessage = function(e) {
        $lightBox.removeClass( 'load' ).addClass( e.data );
        socket.close();
      };
      socket.onerror = function() {
        $lightBox.removeClass( 'load' ).addClass( 'error' );
        socket.close();
      };
    } );
    $( document.body ).append( $obscureBox );
  } );
});
