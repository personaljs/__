Require.js localization module for js applications, also supports apps developed using Backbone.js.

##Connecting to the file: 

Connection is no different from a standard module i18n Require.js.

t
1.Use this way:

    define(['__!nls/site'], function(locale) {
    ....
    });

2.Or this way:

    define(function(require){
      var locale = require('__!nls/site');
    ...
    });

##Use:
####Use without word transformations. 
If you want to use a phrase from the dictionary, than you use: 

In the dictionary file:

    'root' : {
      ...
      'example' : 'Пример'
      ...
    }

Or in code:

    locale.get.example // 'Пример'

####Quantities:
To change the plular form of the word: 

In the dictionary file:

    'root' : {
      ...
      'sun' : 'солнц((е|а|))', // 1 солнце, 2 солнца, 5 солнц
      'glass' : 'стек((ло|ла|ол))' // 1 стекло, 2 стекла, 5 стекол
      ...
    }

Or in the code

    locale('glass', 26); // стекол
    locale('sun', 33); //  солнца

####Gender forms
To change the form of the word in relation to gender, the following is used: 

In the dictionary file:

    'root' : {
      ...
      'read' : 'прочитал[[|а]] книг((у|и))', // прочитал, прочитала (1 книгу, 2 книги, 5 книг)
      'married' : '[[поженился|вышла замуж]]' // тут все ясно:) 
      ...
    }

Or in the code

    locale('read',45, 0) // прочитала (45) книг
    locale('married', null, 1) поженился

Set 1 (number) for Man or 0 for women. If you are using your own criteria to determine the sex, the you can specify the rules for sex determination in require.config.

    require.config({
       ...
        __ : {
            gender : {
                men : 'man', // ваше значение для мужчин
                women : 'woman' // для женщин
            }
        }
        ...
    });

####Passing Values 
If you need to pass any data to a string, use: 

In the dictionary file:

    'root' : {
      ...
      'read' : '{{name}} прочитал[[|а]] {{count}} книг((у|и))', // прочитал, прочитала (1 книгу, 2 книги, 5 книг)
      'married' : '{{name1}} [[поженился на|вышла замуж за]] {{name2}}' // тут все ясно:) 
      ...
    }

Or in the code

    locale('read',45, 0, { name : 'Маша', count : 45 }); // Маша прочитала 45 книг
    locale('married', null, 1, { name1 : 'Вася', name2 : 'Маше' }); Вася поженился на Маше

##Installation:

    require.config({
      ....
      paths: {
        backbone: 'lib/exoskeleton',
        ....
        __: 'lib/__',

        ....
      }


##Change language 
Language change is carried out without reloading the page in contrast to i18n and done by calling the setLang () with the proper options to set the desired language. If the language was not fetched, it is loaded automatically from it's folder. 

Callback-function is called after changing the language (success).

    locale.get.example; // 'Пример'
    locale.setLang('en',callback); 
    locale.get.example; // 'Example'
    
Warning: loading of the language may take some time, depending on the speed of the Internet and the file size.

##Dictionary
Dictionary file looks:

    define({
       'root' : {
          ...
          Здесь находится основной язык
          ...
        },
        'en' : true
    });

en: true means that the folder with the file there is a folder with english localiation file (similar to the name of the main file) with the phrases in the English language. You can connect your localizations on this basis. 

As the main language used phrases from the root.
