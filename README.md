Require.js-модуль для локализации приложений, как и на Backbone.js, так и без него.

##Подключение к файлу:

Подключение ничем не отличается от стандартного модуля i18n Require.js. 

1.Можно так:

    define(['__!nls/site'], function(locvale) {
    ....
    });

2.Можно вот так:



    define(function(require){
      var locale = require('__!nls/site');
    ...
    });

##Использование:
####Использование без преобразований
Если нужно использовать просто фразу из словаря, то используется:

В файле словаря:

    'root' : {
      ...
      'example' : 'Пример'
      ...
    }

В коде:

    locale.get.example // 'Пример'

####Количество
Для изменения формы слова в зависимости от количества используется:

В файле словаря:

    'root' : {
      ...
      'sun' : 'солнц((е|а|))', // 1 солнце, 2 солнца, 5 солнц
      'glass' : 'стек((ло|ла|ол))' // 1 стекло, 2 стекла, 5 стекол
      ...
    }

В коде:

    locale('glass', 26); // стекол
    locale('sun', 33); //  солнца

####Пол    
Для изменения формы слова в зависимости от пола используется:

В файле словаря:

    'root' : {
      ...
      'read' : 'прочитал[[|а]] книг((у|и))', // прочитал, прочитала (1 книгу, 2 книги, 5 книг)
      'married' : '[[поженился|вышла замуж]]' // тут все ясно:) 
      ...
    }

В коде

    locale('read',45, 0) // прочитала (45) книг
    locale('married', null, 1) поженился

Для мужчин необходимо передавать 1, для женщин 0. Если у вас используется свои параметры для определения пола, то в require.config вы можете указать свои правила для определения пола

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

####Передача значений
Если необходимо передать какие-либо данные в строку, используется:

В файле словаря:

    'root' : {
      ...
      'read' : '{{name}} прочитал[[|а]] {{count}} книг((у|и))', // прочитал, прочитала (1 книгу, 2 книги, 5 книг)
      'married' : '{{name1}} [[поженился на|вышла замуж за]] {{name2}}' // тут все ясно:) 
      ...
    }

В коде

    locale('read',45, 0, { name : 'Маша', count : 45 }); // Маша прочитала 45 книг
    locale('married', null, 1, { name1 : 'Вася', name2 : 'Маше' }); Вася поженился на Маше

##Установка:

    require.config({
      ....
      paths: {
        backbone: 'lib/exoskeleton',
        ....
        __: 'lib/__',

        ....
      }


##Смена языка
Смена языка осуществляется без перезагрузки страницы в отличие от i18n и осуществляется вызовом функции setLang() с передачей в нее необходимого языка.
Если язык не был подгружен, то он подгружается автоматически из своей папки.

После смены языка срабатывает callback-функция.

    locale.get.example; // 'Пример'
    locale.setLang('en',callback); // Смена словаря на английский
    locale.get.example; // 'Example'
    
Внимание: подгрузка языка может занять некоторое время и зависит от скорости интернета, размера файла.

##Словари
Файл словаря имеет следующий вид:

    define({
       'root' : {
          ...
          Здесь находится основной язык
          ...
        },
        'en' : true
    });

en : true означает что в папке с файлом имеется папка en с файлом(название аналогично главному файлу) с фразами на английском языке. Можно подключать свои локализации по данному принципу.

В качестве основного языка используется фразы из root.
