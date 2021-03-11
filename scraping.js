var sendDate, receiveDate, responseTime;
const baseURL = "https://api.stackexchange.com";

const sendHttpRequest = (method, url, data) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.responseType = "json";

    if (data) {
      xhr.setRequestHeader("Content-Type", "application/json");
    }

    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        resolve(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject("Something went wrong!");
    };

    xhr.send(JSON.stringify(data));
  });
  return promise;
};

const getData = (value, sorted) => {
  sendHttpRequest("GET", url).then((responseData) => {
    return responseData;
  });
};

function search(value) {
  sendDate = new Date().getTime();
  document.getElementById("main").innerHTML = "";
  document.getElementById("footer").innerHTML = "";

  if (document.getElementById("tag").value == "") alert("please provide input");
  else {
    fromDate = Date.now() - 604800000;
    fromDate = fromDate.toString().slice(0, -3);
    const url1 =
      baseURL +
      "/2.2/search?page=1&pagesize=10&order=desc&sort=creation&site=stackoverflow&filter=!Olkxn-2EYqpU6Xssw7cIUVdBrj.z)kAYy40Tsgw-Qee&fromdate=" +
      fromDate +
      "&tagged=" +
      document.getElementById("tag").value;
    const url2 =
      baseURL +
      "/2.2/search?page=1&pagesize=10&order=desc&sort=votes&site=stackoverflow&filter=!Olkxn-2EYqpU6Xssw7cIUVdBrj.z)kAYy40Tsgw-Qee&fromdate=" +
      fromDate +
      "&tagged=" +
      document.getElementById("tag").value;
    const label = document.createElement("h2");
    label.innerText = "10 Latest Questions:";
    document.getElementById("main").appendChild(label);
    sendHttpRequest("GET", url1)
      .then((responses) => {
        if (responses.has_more)
          for (i = 0; i < 10; i++) {
            createThread(responses.items[i]);
          }
        else {
          const noMore1 = document.createElement("p");
          noMore1.textContent = "None";
          document.getElementById("main").appendChild(noMore1);
        }
      })
      .then(() => {
        const label = document.createElement("h2");
        label.innerText = "10 Most Votes Questions:";
        document.getElementById("main").appendChild(label);
        sendHttpRequest("GET", url2)
          .then((responseData) => {
            if (responseData.has_more)
              for (y = 0; y < 10; y++) {
                createThread(responseData.items[y]);
              }
            else {
              const noMore2 = document.createElement("p");
              noMore2.textContent = "None";
              document.getElementById("main").appendChild(noMore2);
            }
          })
          .then(() => {
            receiveDate = new Date().getTime();
            responseTimeMs = (receiveDate - sendDate) / 1000;
            document
              .getElementById("footer")
              .appendChild(document.createElement("hr"));
            const respTime = document.createElement("h3");
            respTime.id = "response-time";
            respTime.innerText =
              "Total Response Time: " + responseTimeMs.toString() + " seconds.";
            document.getElementById("footer").appendChild(respTime);

            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "collapsible.js";
            document.body.appendChild(s);
          });
      });
  }
}

function createThread(thread) {
  const results = document.createElement("div");
  results.id = "questions";
  const newButton = document.createElement("button");
  title =
    thread.title +
    " - Date: " +
    formatDate(thread.creation_date) +
    " - Votes: " +
    thread.score;
  const newContent = document.createTextNode(title);
  newButton.appendChild(newContent);
  newButton.className = "collapsible";
  results.appendChild(newButton);

  const newThread = document.createElement("div");
  newThread.className = "content";
  newThread.innerHTML = thread.body;

  if (thread.comment_count > 0) {
    newThread.appendChild(document.createElement("hr"));
    newThread.appendChild(
      getComments(thread.comments, thread.comment_count, true)
    );
  }
  if (thread.answer_count > 0) {
    newThread.appendChild(document.createElement("hr"));
    newThread.appendChild(getAnswers(thread.answers, thread.answer_count));
  }

  results.appendChild(newThread);

  results.appendChild(document.createElement("br"));

  document.getElementById("main").appendChild(results);
}

function getAnswers(answers, answer_count) {
  const answersDiv = document.createElement("div");
  answersDiv.className = "answers";
  const ansTitle = document.createElement("h2");
  ansTitle.textContent = "Answers:";
  answersDiv.appendChild(ansTitle);

  for (k = 0; k < answer_count; k++) {
    const a = document.createElement("div");
    const header = document.createElement("h5");
    header.textContent =
      "Vote(s): " +
      answers[k].score +
      " - Answered on: " +
      formatDate(answers[k].creation_date);
    a.appendChild(header);
    const ansBody = document.createElement("div");
    ansBody.innerHTML = answers[k].body;
    a.appendChild(ansBody);

    if (answers[k].comment_count > 0) {
      a.appendChild(document.createElement("hr"));
      a.appendChild(
        getComments(answers[k].comments, answers[k].comment_count, false)
      );
    }

    a.style.border = "1px solid black";
    a.style.padding = "10px";
    answersDiv.appendChild(a);
  }
  return answersDiv;
}

function getComments(comments, comment_count, QorA) {
  const commentsDiv = document.createElement("div");
  commentsDiv.className = "comments";
  var cmtTitle;
  if (QorA) {
    cmtTitle = document.createElement("h3");
    cmtTitle.textContent = "Comments:";
  } else {
    cmtTitle = document.createElement("h3");
    cmtTitle.textContent = "Answer's comments:";
  }
  commentsDiv.appendChild(cmtTitle);

  for (j = 0; j < comment_count; j++) {
    const cmt = document.createElement("div");
    const header = document.createElement("h5");
    header.textContent =
      "Vote(s): " +
      comments[j].score +
      " - Commented on: " +
      formatDate(comments[j].creation_date);
    cmt.appendChild(header);
    const ansBody = document.createElement("div");
    ansBody.innerHTML = comments[j].body;
    cmt.appendChild(ansBody);
    cmt.style.borderBottom = "0.5px solid grey";
    cmt.style.padding = "10px";
    cmt.style.margin = "20px";
    cmt.style.paddingTop = "0px";
    cmt.style.marginTop = "0px";
    commentsDiv.appendChild(cmt);
  }
  return commentsDiv;
}

function formatDate(date) {
  const milliseconds = date * 1000;

  const dateObject = new Date(milliseconds);

  return dateObject.toLocaleString("en-US", { timeZoneName: "short" });
}
