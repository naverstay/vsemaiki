<?
if ((isset($_POST['name']) && $_POST['order_name'] != "") && (isset($_POST['phone']) && $_POST['order_phone'] != "")) { //Проверка отправилось ли наше поля name и не пустые ли они
    $to = 'naverstay.me@gmail.com'; //Почта получателя, через запятую можно указать сколько угодно адресов
    $subject = 'Обратный звонок'; //Загаловок сообщения
    $message = '
                <html>
                    <head>
                        <title>' . $subject . '</title>
                    </head>
                    <body>
                        <p>Телефон: ' . $_POST['phone'] . '</p>                        
                    </body>
                </html>'; //Текст нащего сообщения можно использовать HTML теги
    $headers = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
    $headers .= "From: Отправитель <from@example.com>\r\n"; //Наименование и почта отправителя
    mail($to, $subject, $message, $headers); //Отправка письма с помощью функции mail
}
?>