"use strict";

var words = "Приехал : Проспект Мира д . 101 ( вход со двора ), переписали мои данные , выспрашивали между делом с кем живу , где работаю ...".split(' ');
var stress = words.map(function (x) {
    return 1.0;
});
stress.splice(2, 5, 1.5, 1.5, 1.5, 1.5, 1.5);


function write_answer(selections) {
    console.dir(selections);
}


function selectionCheck(selections, left, right) {
    for (var i = 0; i < selections.length; i++) {
        var sl = selections[i][0];
        var sr = selections[i][1];

        if (sl <= left && left <= sr && sl <= right && right <= sr) return ["inside", [sl, sr]];

        if (sr < left || sl > right) continue;

        return ["invalid"];
    }
    return ["valid"];
}

function makeSpan(index, text, stress) {
    var span = document.createElement("span");
    span.setAttribute("id", index);
    span.textContent = text;
    span.setAttribute('style', "margin-right: 2px; margin-left: 2px; font-size: " + stress + "em;");
    return span;
}

function redraw(root, selections, words, stress) {
    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }

    var next_id = 0;

    for (var i = 0; i < selections.length; i++) {
        var sl = selections[i][0];
        var sr = selections[i][1];

        // add all words before the selection
        for (next_id; next_id < sl; next_id++) {
            root.appendChild(makeSpan(next_id, words[next_id], stress[next_id]));
        }

        // add all words of the selection
        var mark = document.createElement("mark");
        mark.setAttribute("id", sl + "_" + sr);
        for (next_id; next_id < sr + 1; next_id++) {
            mark.appendChild(makeSpan(next_id, words[next_id], stress[next_id]));
        }
        root.appendChild(mark);
    }

    // add remaining words after all selections
    for (next_id; next_id < words.length; next_id++) {
        root.appendChild(makeSpan(next_id, words[next_id], stress[next_id]));
    }
}

var selections = [];

var task_root = document.getElementsByClassName("tagger")[0];

redraw(task_root, selections, words, stress);

task_root.onmouseup = function (e) {
    var s = window.getSelection();
    if (s.isCollapsed) {
        var r = s.getRangeAt(0);
        var o = r.endContainer.parentNode;

        if (o.parentNode.tagName === 'MARK') {

            var sstr = o.parentNode.id.split('_');
            var c = [parseInt(sstr[0]), parseInt(sstr[1])];
            selections = selections.filter(function (sel) {
                return sel[0] !== c[0] || sel[1] !== c[1];
            });
            s.removeAllRanges();
            write_answer(selections);
            redraw(e.currentTarget, selections, words, stress);
        }
    } else {
        var r = s.getRangeAt(0);
        var o = r.endContainer.parentNode;

        var left = parseInt(r.startContainer.parentNode.getAttribute("id"));
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
                        return sel[0] !== c[1][0] || sel[1] !== c[1][1];
                    });
                    break;
            }
        }
        s.removeAllRanges();
        write_answer(selections);
        redraw(e.currentTarget, selections, words, stress);
    }
};
