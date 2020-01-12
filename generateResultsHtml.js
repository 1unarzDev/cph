/**
 *
 * @param {*} results an object containing the evaluated testcase results
 * @param {*} isLastResult boolean wether the results are final or any evaluation is pending
 */

const { workspace, ConfigurationTarget } = require("vscode");
const config = require("./config");


function firstTimeMessage() {
  let preferences = workspace.getConfiguration(
    "competitive-programming-helper"
  );
  console.log(preferences);
  let firstTime = preferences.get("firstTime");
  console.log("FT", firstTime);
  let message;
  if (firstTime || firstTime === "true") {
    message = `<div class="first-time-message">
    <h2>First time welcome guide</h2>
    <p>Here are some tips to get you started:
      <ul>
        <li>Add support for tons of website by downloading the browser extension <a href="https://github.com/jmerle/competitive-companion#readme" target="_blank">Competitive Companion</a>.

        <br><br>

        <a class="btn" href="https://chrome.google.com/webstore/detail/competitive-companion/cjnmckjndlpiamhfimnnjmnckgghkjbl">Download for Google Chrome</a>

        <a class="btn" href="https://addons.mozilla.org/en-US/firefox/addon/competitive-companion/">Download for Firefox</a>

        <br>
        Install and the go to its settings and enter port number <code>${config.port}</code>. Then, just click a button on any problem and auto create file and testcases!</li>

        <li>Change your generated files location to prevent cluttering of your workspace.Go to VS Code Settings > Extensions > Competitive programming helper and enter any existing folder location where temp files will be saved.</li>

        <li>
          Add  custom compiler flags from settings like <code>-O2 -stdc++</code> etc.
        </li>


      </ul>
      <b>Checkout the <a href="https://github.com/agrawal-d/competitive-programming-helper#readme" target="_blank">readme</a> for more tips.</b>
      <br>
      <br>
      <button class="btn btn-red" onclick="this.parentElement.style.display='none'">Close</button>
    </p>
  </div><br>`;
  } else {
    message = '';
  }
  preferences.update("firstTime", false, ConfigurationTarget.Global);
  preferences.update("firstTime", false, ConfigurationTarget.Workspace);
  preferences.update("firstTime", false, ConfigurationTarget.WorkspaceFolder);

  return message;
}

function getWebviewContent(results, isLastResult, jspath, filepath) {
  var modf = "";
  var count = 1;
  for (var element of results) {
    if (element.got.length > 30000) {
      element.got = "Too long to display";
    }
    let caseId = "cid" + Date.now() + Math.random();
    console.log(results);
    modf += `
    <div class="case case-${count - 1}" data-casenum="${count - 1}" id="${caseId}">
        <p><b>Testcase ${count} <span class="passorfail ${
      element.passed ? "pass" : "fail"
      }">${element.passed ? "PASSED" : "FAILED"}</span> <span class="exec-time">${
      element.time
      }ms</span>

         <span class="right time">
         <button class="btn btn-green" onclick="rerunTestCase(this)">&#x21BA; </button>
            <button class="btn btn-red" onclick="deleteTestCase(this)">&#x2A2F;  </button>
         </span></b></p>
        Input :
        <textarea class="selectable input-textarea">${element.input.trim()}</textarea>
        Expected Output:
        <textarea class="selectable expected-textarea">${element.expected.trim()}</textarea>
        Received Output:
        <textarea readonly class="selectable received-textarea">${element.got.trim()}</textarea>
    </div>
            `;
    count++;
  }
  let pre = "";
  pre += firstTimeMessage() + `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, text-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
    * {
        -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
           -khtml-user-select: none; /* Konqueror HTML */
             -moz-user-select: none; /* Firefox */
              -ms-user-select: none; /* Internet Explorer/Edge */
                  user-select: none; /* Non-prefixed version, currently
                                        supported by Chrome and Opera */;
        cursor:default !important;
      }
      .selectable {
        -webkit-touch-callout: text; /* iOS Safari */
          -webkit-user-select: text; /* Safari */
           -khtml-user-select: text; /* Konqueror HTML */
             -moz-user-select: text; /* Firefox */
              -ms-user-select: text; /* Internet Explorer/Edge */
                  user-select: text; /* Non-prefixed version, currently
                                        supported by Chrome and Opera */;
        cursor:text !important;
      }
      body{
          margin-bottom:100px;
          padding:0px;
      }
      .btn:hover{
          opacity:0.8;
          2px solid black;
      }
      #pane{
          position:fixed;
          bottom:0px;
          left:0px;
          width:100%;
          padding:15px;
          background:var(--vscode-sideBar-background);
          box-shadow:0px 0px 10px 0px rgba(50,50,50,0.3);
      }
        .case {
            background: rgba(0,0,0,0.1);
            padding: 8px;
            margin-bottom: 2px;
        }

        .exec-time{
          background: #fbff001c;
          color:white;
          padding:2px 5px 2px 5px;
          font-size:80%;
          border-radius:5px;
        }

        a.btn{
          text-decoration:none;
          display:inline-block;
        }

        .first-time-message{
          padding:10px;
          background:rgba(0,0,0,0.1);
        }
        .first-time-message ul li{
          margin-bottom:10px;
        }
        .pre, pre, textarea {
            background: var(--input.background);
            width:100%;
            display:block;
            background:rgba(0,0,0,0.2);
            outline:none !important;
            border:0px;
            color: bisque;
            max-width:100%;
            overflow-x:auto;
            resize:none;
            border:1px solid transparent;
        }
        textarea:focus, textarea:active{
            background:black;
            outline:none !important;
            border:1px solid #3393cc;
        }

        .right {
            float: right;
        }

        .time {
            color: rgb(185, 185, 84);
        }

        .fail {
            color: rgb(126, 38, 38);
        }

        .pass {
            color: rgb(37, 87, 37);
        }
        .btn{
            padding:2px 5px 2px 5px;
            background:#3393CC91;
            color:white;
            outline:none;
            margin-right:2px;
            margin-bottom:5px;
            border:2px solid transparent;
        }
        .btn-green{
            background:#70B92791;
        }
        .btn-red{
            background:#B9274391
        }
        h4{
            padding:5px;
        }
        #filepath{
          display:none;
        }
        #running-next-box{
          padding:10px;
        }
    </style>
</head>

<body><span id="filepath">${filepath}</span>`;

  if (results.length == 0) {
    let caseId = "cid" + Date.now() + Math.random();
    pre += `<div class="case case-0" data-casenum="0" id="${caseId}">
        <p><b>Unsaved Testcase</span>
        <span class="right time">
        <button class="btn btn-green" onclick="rerunTestCase(this)">&#x21BA; </button>
          <button class="btn btn-red" onclick="deleteTestCase(this)">&#x2A2F; </button>
        </span></b></p>
        Input :
        <textarea  class="selectable"></textarea>
        Expected Output:
        <textarea  class="selectable"></textarea>
        Received Output:
        <textarea readonly class="selectable">Run to show output</textarea>
        </div>`;
  }
  pre += modf;
  if (!isLastResult) {
    pre += "<div id='running-next-box'><br><br>Running next testcase...<br><br><button class='btn btn-red' onclick='stopRunning()'>🛑 Stop this</button></div>";
  }
  pre += `
<div id="app"></div>
<div id="pane">
<button class="btn" id="new-testcase" onclick="addTestCase()">➕ New</button>
<button class='btn btn-red' onclick='stopRunning()'>🛑 Stop</button>
<button class="btn btn-green" onClick="saveAndRerunAll()">&#x1F4BE; Save and run</button>
<br>
<small id="unsaved"></small>
</div>
</body>
<script src="${jspath}"></script>
</html>
`;
  return pre;
}

module.exports = getWebviewContent;
