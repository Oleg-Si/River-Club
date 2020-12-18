<?php
require_once 'vendor/autoload.php';

$transport = new Swift_SmtpTransport("smtp.gmail.com", 465, 'ssl');
$transport->setUsername("mgh62008@gmail.com");
$transport->setPassword("INVZ4mYdTZibxJhsf7");

$mailer = new Swift_Mailer($transport);

$message = new Swift_Message();

if( $_SERVER['REQUEST_METHOD'] === 'POST') {
  $dateIn = $_POST['dateIn'];
  $dateOut = $_POST['dateOut'];
  $price = $_POST['price'];
  $name = $_POST['name'];
  $tel = $_POST['tel'];

  $message->setSubject("Новая заявка");
  $message->setFrom(['testprojectethernal@gmail.com' => 'RiverClub']);
  $message->setTo('xwx18@mail.ru');


  $msg_content = '<!doctype html>
  <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
    </head>
    <body>
    <h1>Новая заявка</h1>

    <table>
      <tbody>
        <tr>
          <td>Имя</td>
          <td>' . $name .'</td>
        </tr>

        <tr>
          <td>Телефон</td>
          <td>' . $tel .'</td>
        </tr>

        <tr>
          <td>Дата</td>
          <td>с ' . $dateIn . ' по ' . $dateOut . '</td>
        </tr>

        <tr>
          <td>Стоимость</td>
          <td>' . $price . '</td>
        </tr>

      </tbody>
    </table>
    </body>
  </html>';

  $message->setBody($msg_content, 'text/html');

  $result = $mailer->send($message);

  if ($result) {
      print("Успешно отправлено");
  }
  else {
      print("Не удалось отправить");
  }
}


