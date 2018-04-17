
var words = "Приехал : Проспект Мира д . 101 ( вход со двора ), переписали мои данные , выспрашивали между делом с кем живу , где работаю ...".split(' ');


function selectionCheck (selections, left, right) {
    for (var i=0; i<selections.length; i++)
    {
        var sl = selections[i][0];
        var sr = selections[i][1];

        if (sl <= left && left <=sr && sl <=right && right <= sr)
            return ["inside", [sl, sr]];

        if (sr < left || (sl > right)) continue;

        return ["invalid"];
    }
    return ["valid"];
}

// That function is used in Yandex.Toloka
function makeSpan(index, text) {
    var span = document.createElement("span");
    span.setAttribute("id", next_id);
    span.textContent = words[next_id];
    span.setAttribute("style", "margin-right: 2px");
    span.setAttribute("style", "margin-left: 2px");
    return span;
}

// That function is used in Yandex.Toloka
function report(selections, words){
    var rep = [];
    var next_id = 0;
    for (var i=0; i<selections.length; i++){
        var sl = selections[i][0];
        var sr = selections[i][1];

        // add all words before the selection
        for (next_id; next_id<sl; next_id++){
            rep.push([words[next_id], "o"]);
        }

        // add all words of the selection
        var has_beginning = false;
        for (next_id; next_id < sr+1; next_id++){
            var tg = has_beginning ? 'i' : 'b';
            has_beginning = true;
            rep.push([words[next_id], tg]);
        }
    }
    // add remaining words after all selections
    for(next_id; next_id < words.length; next_id++) {
        rep.push([words[next_id], "o"]);
    }
    return rep;
}

function redraw (root, selections, words) {
    while (root.firstChild)
        {root.removeChild(root.firstChild);}

    var next_id = 0;

    for (var i=0; i<selections.length; i++){
        var sl = selections[i][0];
        var sr = selections[i][1];

        // add all words before the selection
        for (next_id; next_id<sl; next_id++){
            var span = document.createElement("span");
            span.setAttribute("id", next_id);
            span.textContent = words[next_id];
            root.appendChild(span);
        }

        // add all words of the selection
        var mark = document.createElement("mark");
        mark.setAttribute("id", sl + "_" + sr);
        for (next_id; next_id < sr+1; next_id++){
            var span = document.createElement("span");
            span.setAttribute("id", next_id);
            span.textContent = words[next_id];
            mark.appendChild(span);
        }
        root.appendChild(mark)
    }

    // add remaining words after all selections
    for(next_id; next_id < words.length; next_id++) {
        var span = document.createElement("span");
        span.setAttribute("id", next_id);
        span.textContent = words[next_id];
        root.appendChild(span);
    }
}



var selections = [];


var task_root = document.getElementsByClassName("tagger")[0];

redraw(task_root, selections, words);

report(selections, words);

task_root.onmouseup = function (e) {
    var s = window.getSelection();
    if(s.isCollapsed){
        var r = s.getRangeAt(0);
        var o = r.endContainer.parentElement;

        if (o.parentElement.tagName === 'MARK') {

            var sstr = o.parentElement.id.split('_');
            var c = [parseInt(sstr[0]), parseInt(sstr[1])];
            selections = selections.filter(function (sel) {
                return sel[0] !== c[0] || sel[1] !== c[1]
            });
            s.removeAllRanges();
            redraw(e.currentTarget, selections, words);
        }
    } else {
        var r = s.getRangeAt(0);
        var o = r.endContainer.parentElement;

        var left = parseInt(r.startContainer.parentElement.getAttribute("id"));
        var right = parseInt(o.getAttribute("id"));

        if (!isNaN(left) && !isNaN(right)) {
            c = selectionCheck(selections, left, right);

            switch (c[0]) {
                case "invalid":
                    break;
                case "valid":
                    selections.push([left, right]);
                    selections.sort(function (s1, s2) {
                        return s1[0] - s2[0];
                    });
                    break;
                case "inside":
                    selections = selections.filter(function (sel) {
                        return sel[0] !== c[1][0] || sel[1] !== c[1][1]
                    });
                    break;
            }
        }
        s.removeAllRanges();
        redraw(e.currentTarget, selections, words);
    }
};
