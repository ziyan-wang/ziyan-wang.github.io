(function () {
  // naive cryptography
  var alphabetMap = {48: 71, 49: 79, 50: 103, 51: 73, 52: 83, 53: 108, 54: 110, 55: 118, 56: 105, 57: 55, 65: 81, 66: 77, 67: 86, 68: 121, 69: 72, 70: 122, 71: 56, 72: 97, 73: 50, 74: 119, 75: 89, 76: 101, 77: 48, 78: 98, 79: 75, 80: 88, 81: 109, 82: 52, 83: 61, 84: 106, 85: 43, 86: 68, 87: 82, 88: 111, 89: 74, 90: 107, 97: 90, 98: 112, 99: 53, 100: 99, 101: 120, 102: 104, 103: 100, 104: 66, 105: 117, 106: 51, 107: 87, 108: 54, 109: 76, 110: 115, 111: 57, 112: 70, 113: 80, 114: 116, 115: 78, 116: 84, 117: 65, 118: 102, 119: 47, 120: 85, 121: 113, 122: 69, 43: 114, 47: 67, 61: 49};
  var reverseAlphabetMap = {71: 48, 79: 49, 103: 50, 73: 51, 83: 52, 108: 53, 110: 54, 118: 55, 105: 56, 55: 57, 81: 65, 77: 66, 86: 67, 121: 68, 72: 69, 122: 70, 56: 71, 97: 72, 50: 73, 119: 74, 89: 75, 101: 76, 48: 77, 98: 78, 75: 79, 88: 80, 109: 81, 52: 82, 61: 83, 106: 84, 43: 85, 68: 86, 82: 87, 111: 88, 74: 89, 107: 90, 90: 97, 112: 98, 53: 99, 99: 100, 120: 101, 104: 102, 100: 103, 66: 104, 117: 105, 51: 106, 87: 107, 54: 108, 76: 109, 115: 110, 57: 111, 70: 112, 80: 113, 116: 114, 78: 115, 84: 116, 65: 117, 102: 118, 47: 119, 85: 120, 113: 121, 69: 122, 114: 43, 67: 47, 49: 61};
  var postAlphabetMap = {43: 95, 47: 45, 61: 36};
  var reversePostAlphabetMap = {95: 43, 45: 47, 36: 61};

  var projectUrls = [
    'Za4G5a0neq7sZo49cR2AJg7TegUfpLDNxRDAcL7leIMlc8BfpuOTkROfZoFBc86fpd11',
    'Za4G5a0neq7EpgU6pLcFpL_Akg6GZaDueL6fe-11',
    'Za4G5a0neq73paDTJLDqeLbNpIDWe-11',
  ];

  function encrypt(string) {
    if (typeof string !== 'string' || string.length === 0) {
      throw new Error('encrypt failed: illegal argument');
    }
    string = window.btoa(string);
    var result = '';
    for (var i = 0; i < string.length; i += 1) {
      var alphabet = alphabetMap[string.charCodeAt(i)];
      if (alphabet === undefined) {
        throw new Error('encrypt failed: unrecognized character <' + string[i] + '>');
      }
      var postAlphabet = postAlphabetMap[alphabet];
      result += String.fromCharCode(postAlphabet === undefined ? alphabet : postAlphabet);
    }
    return result;
  }

  function decrypt(cipher) {
    if (typeof cipher !== 'string' || cipher.length === 0) {
      throw new Error('decrypt failed: illegal argument');
    }
    var result = '';
    for (var i = 0; i < cipher.length; i += 1) {
      var charCode = cipher.charCodeAt(i);
      var postAlphabet = reversePostAlphabetMap[charCode];
      var alphabet = reverseAlphabetMap[postAlphabet === undefined ? charCode : postAlphabet];
      if (alphabet === undefined) {
        throw new Error('decrypt failed: unrecognized character <' + cipher[i] + '>');
      }
      result += String.fromCharCode(alphabet);
    }
    return window.atob(result);
  }

  function newCaptcha() {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var problem;
    return {
      nextProblem: function () {
        var answer = getRandomInt(19, 90);
        var rightOperand = getRandomInt(1, 9);
        var isPlus = Math.random() < 0.5;
        var leftOperand = isPlus ? answer - rightOperand : answer + rightOperand;
        problem = {
          leftOperand: leftOperand.toString(),
          operator: isPlus ? 'plus' : 'minus',
          rightOperand: rightOperand.toString(),
        }
        return problem;
      },
      validate: function (input) {
        var leftOperand = parseInt(problem.leftOperand);
        var rightOperand = parseInt(problem.rightOperand);
        var correctAnswer = problem.operator === 'plus' ? leftOperand + rightOperand : leftOperand - rightOperand;
        if (input === correctAnswer.toString()) {
          var matches = /projectId=([^&]+)/.exec(window.location.search);
          if (matches === null || matches.length !== 2) {
            throw new Error('Illegal query string');
          }
          var projectId = parseInt(matches[1]);
          if (isNaN(projectId)) {
            throw new Error('Illegal projectId');
          }
          document.getElementById('captchaWrapper').style.display = 'none';
          document.getElementById('wrongInputSign').style.display = 'none';
          document.getElementById('rightInputSign').style.display = 'inline-block';
          var targetUrl = decrypt(projectUrls[projectId - 1]);
          window.location.replace(targetUrl);
          return true;
        } else {
          document.getElementById('wrongInputSign').style.display = 'inline-block';
          applyCaptchaProblem();
          return false;
        }
      },
    }
  }

  var captcha;
  function applyCaptchaProblem() {
    var imageNode = '<img src="../images/captcha/{placeholder}.svg" width="15" height="30" loading="lazy" alt="captcha image"/>';
    var placeHolder = '{placeholder}';

    captcha = newCaptcha();
    var problem = captcha.nextProblem();
    var nodes = [];
    for (var i = 0; i < problem.leftOperand.length; i += 1) {
      var digit = parseInt(problem.leftOperand[i]);
      nodes.push(imageNode.replace(placeHolder, encrypt(digit.toString())));
    }
    nodes.push(imageNode.replace(placeHolder, encrypt(problem.operator)));
    nodes.push(imageNode.replace(placeHolder, encrypt(parseInt(problem.rightOperand).toString())));
    nodes.push(imageNode.replace(placeHolder, encrypt('equal')));
    document.getElementById('captcha').innerHTML = nodes.join('');
  }

  function validateCaptchaAnswer() {
    var answer = document.getElementById('captchaInput').value;
    document.getElementById('captchaInput').value = '';
    captcha.validate(answer);
  }

  function onNotARobotCheckboxClick() {
    document.getElementById('notARobotCheckboxWrapper').style.display = 'none';
    document.getElementById('captchaWrapper').style.display = 'flex';
  }

  function addEnterKeyListenerOnCaptchaInput() {
    document.getElementById('captchaInput').addEventListener('keyup', function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('submitButton').click();
      }
    });
  }

  addEnterKeyListenerOnCaptchaInput();
  applyCaptchaProblem();
  window.validateCaptchaAnswer = validateCaptchaAnswer;
  window.onNotARobotCheckboxClick = onNotARobotCheckboxClick;

})();
