js-шаблонизатор 

Использование:

Обьект с локализацией вида:

    var locale = {
      'ru' : {
         'user' : '[мужчина|женщина]',
         'create' : 'создал[|а]',
         'post' : 'запис(ь|и|ей)'
      },
      'en' : {
         'user' : '[men|women]',
         'create' : 'create',
         'post' : 'post(|s)'
    	}
    };

Вывод в тексте:

    __('user') + __('create') + __('post', 1);



