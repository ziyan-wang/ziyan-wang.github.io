(function () {

  function initializeDarkMode() {
    var toggleDarkModeButtons = [".gg-moon", ".gg-sun"].map(function(className) { 
      return document.querySelector(className);
    });
    var resetDarkModeButton = document.querySelector(".link-reset-dark-mode");
    var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  
    // decide which theme to use by localStorage and media
    var currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      document.body.classList.add("manual-theme");
    }
    if (prefersDarkScheme.matches) {
      if (currentTheme === "light") {
        document.body.classList.toggle("light-theme");
      }
    } else {
      if (currentTheme === "dark") {
        document.body.classList.toggle("dark-theme");
      }
    }

    // listen to toggleDarkModeButton
    toggleDarkModeButtons.forEach(function(button) {
      button.addEventListener("click", function () {
        if (prefersDarkScheme.matches) {
          document.body.classList.toggle("light-theme");
          var theme = document.body.classList.contains("light-theme") ? "light" : "dark";
        } else {
          document.body.classList.toggle("dark-theme");
          var theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
        }
        document.body.classList.add("manual-theme");
        localStorage.setItem("theme", theme);
      });
    })
  
    // listen to resetDarkModeButton
    resetDarkModeButton.addEventListener("click", function () {
      localStorage.removeItem("theme");
      document.body.classList.remove("light-theme");
      document.body.classList.remove("dark-theme");
      document.body.classList.remove("manual-theme");
    });
  }

  function initializeBiographyReadMore() {
    var readMoreButton = document.querySelector(".btn-read-more-biography");
    var biographyParagraph = document.querySelector(".biography");

    // decide whether to unfold by localStorage
    var storageFoldState = localStorage.getItem("biographyFold");
    var foldState = (storageFoldState === null) ? "folded" : storageFoldState;
    if (foldState === "unfolded") {
      biographyParagraph.classList.remove("text-fade-out");
      readMoreButton.innerHTML = "Read less &#9650;";
    }

    // listen to readMoreButton
    readMoreButton.addEventListener("click", function () {
      biographyParagraph.classList.toggle("text-fade-out");
      if (foldState === "folded") {
        // unfold
        readMoreButton.innerHTML = "Read less &#9650;";
        foldState = "unfolded";
        localStorage.setItem("biographyFold", foldState);
      } else if (foldState === "unfolded") {
        // fold
        readMoreButton.innerHTML = "Read more &#9660;";
        foldState = "folded";
        localStorage.removeItem("biographyFold");
      } else {
        throw new Error("Unexpected foldState: " + foldState.toString());
      }
    });
  }

  function initializeLanguages() {
    var multilanguageMap = {
      biography: {
        english: '<p>Ziyan is a full stack developer and a researcher.</p><p> <strong>Ziyan devotes himself to making programming languages and tools better.</strong> Specifically, he wants to simplify the way people learn programming and the way developers work, by designing and implementing safe general-purpose and <a href="https://en.wikipedia.org/wiki/Domain-specific_language">domain-specific languages</a> with high development productivity and diverse <a href="https://en.wikipedia.org/wiki/Programming_paradigm">programming paradigms</a>.</p><p> <strong>Why?</strong> One of the reasons: it\'s Ziyan\'s observation that a large proportion of software defects, i.e. bugs and vulnerabilities, though seemingly nothing more than run-of-the-mill errors in code, can be ultimately traced back to the underlying design flaws of languages. He believes that a well-designed language eliminates such defects at the very root, far before developers start coding.</p><p> However, Ziyan understands that proposing novel languages may be too ambitious, running the risk of not seeing real use. He thus makes a compromise to also adopt <a href="https://en.wikipedia.org/wiki/Program_analysis">program analysis</a> and <a href="https://en.wikipedia.org/wiki/Optimizing_compiler">compiler optimization</a> as practical ways to improve code written in existing flawed languages.</p>',
        chinese: '<p>子彦是一名全栈开发者和研究者。</p><p><strong>子彦致力于改善编程语言和工具。</strong>具体来说，他想简化人们学习编程的方式和开发者的工作方式。他的方法是设计和实现安全的通用语言和<a href="https://en.wikipedia.org/wiki/Domain-specific_language">领域特定语言</a>，这些语言具有较高的开发效率和多样化的<a href="https://en.wikipedia.org/wiki/Programming_paradigm">编程范式</a>。</p><p><strong>为什么？</strong>其中一个原因是：子彦观察到，大部分的软件缺陷（即 bug 和安全漏洞）虽然看上去不过是代码里普通的错误，但可以最终追溯到语言中潜在的设计缺陷。他认为精心设计的语言可以从根本上消除这些软件缺陷，远远早于开发者开始编写代码。</p><p>然而子彦明白，提出新的语言可能过于宏伟，冒着看不到实际使用的风险。因此，他做出妥协。对于用现有的有缺陷的语言编写的代码，他也将<a href="https://en.wikipedia.org/wiki/Program_analysis">程序分析</a>和<a href="https://en.wikipedia.org/wiki/Optimizing_compiler">编译器优化</a>作为改进这些代码的实用方法。</p>',
        esperanto: '<p>Ziyan estas Full-Stack programisto kaj esploristo.</p><p> <strong>Ziyan dediĉas sin al plibonigi programlingvojn kaj ilojn.</strong> Specife, li volas simpligi la manieron, ke homoj lernas programadon kaj la manieron, ke programistoj laboras, per projektado kaj efektivigo de sekuraj ĝeneraluzeblaj kaj <a href="https://en.wikipedia.org/wiki/Domain-specific_language">domajnospecifaj programlingvoj</a> kun alta produktiveco kaj diversaj <a href="https://en.wikipedia.org/wiki/Programming_paradigm">programaj paradigmoj</a>.</p><p> <strong>Kial?</strong> Unu el la kialoj: Ziyan komentas, ke granda proporcio de programaj difektoj, t.e. cimoj kaj vundeblecoj, kvankam ŝajne nenio pli ol ordinaraj eraroj en kodo, finfine povas esti spurita al la subaj projektaj difektoj de programlingvoj. Li pensas, ke bone projektita programlingvo forigas tiajn programajn difektojn tute antaŭ ol programistoj ekkodas.</p><p> Tamen Ziyan komprenas, ke proponi novajn lingvojn povas esti tro ambicia, riskante ne vidi realan uzon. Li tiel faras kompromison ankaŭ adopti <a href="https://en.wikipedia.org/wiki/Program_analysis">programanalizon</a> kaj <a href="https://en.wikipedia.org/wiki/Optimizing_compiler">kompililan optimumigon</a> kiel praktikajn manierojn plibonigi kodon skribitan en ekzistantaj difektaj lingvoj.</p>',
      },
    };
    
    function switchLanguage(language) {
      var biography = document.getElementById("biography");
      if (language === "english") {
        biography.innerHTML = multilanguageMap.biography.english;
        biography.lang = "en";
        biography.classList.remove("strong-as-bold");
      } else if (language === "chinese") {
        biography.innerHTML = multilanguageMap.biography.chinese;
        biography.lang = "zh";
        biography.classList.add("strong-as-bold");
      } else if (language === "esperanto") {
        biography.innerHTML = multilanguageMap.biography.esperanto;
        biography.lang = "eo";
        biography.classList.remove("strong-as-bold");
      } else {
        throw new Error("Unrecognized language: " + language);
      }
    }

    // switch language at page load according to localStorage
    var languageState = localStorage.getItem("language");
    if (languageState !== null) {
      switchLanguage(languageState);
      var languageSelectInit = document.getElementById("language-select");
      for (var index in languageSelectInit.options) {
        if (languageSelectInit.options[index].value === languageState) {
          languageSelectInit.options[index].selected = true;
          break;
        }
      }
    }

    // listen to language change on the select
    var languageSelect = document.getElementById("language-select");
    languageSelect.addEventListener("change", function (event) {
      var language = event.target.value;
      switchLanguage(language);
      if (language === "english") {
        localStorage.removeItem("language");
      } else {
        localStorage.setItem("language", language);
      }
      
      languageSelect.classList.toggle("display-none");
      switchLanguageButton.classList.toggle("display-none");
    });

    // listen to switch languge button to show the language select
    var switchLanguageButton = document.querySelector(".btn-switch-language");
    switchLanguageButton.addEventListener("click", function () {
      languageSelect.classList.toggle("display-none");
      switchLanguageButton.classList.toggle("display-none");
    });
  }

  initializeDarkMode();
  initializeBiographyReadMore();
  initializeLanguages();

})();
