# tagging_tool_js
Lightweight tool for sentence tagging (i.e. NER markup) on JavaScript

In Toloka you must create 2 input variables:
* input: string - space separated words to show
* stress: string - space separated floats of word sizes in em

and 1 output variable:
* output: [[int]] - arrays of taggs represented as tuple [first_word, last_word] 
