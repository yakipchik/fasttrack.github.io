<?php
//require 'phpmailer/PHPMailer.php';
//require 'phpmailer/SMTP.php';
//require 'phpmailer/Exception.php';
//use PHPMailer\PHPMailer\PHPMailer;
//use PHPMailer\PHPMailer\SMTP;
//use PHPMailer\PHPMailer\Exception;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// Формирование самого письма

$title = "Обратная связь";
$body = 'test';
// Настройки PHPMailer
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth = true;
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = function ($str, $level) {
        $GLOBALS['status'][] = $str;
    };
    // Настройки вашей почты
    $mail->Host = 'smtp.mail.ru'; // SMTP сервера вашей почты
    $mail->Username = 'send.test123@mail.ru'; // Логин на почте
    $mail->Password = 'xx1DGFkFi5HVBEdWxd91'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;
    $mail->setFrom('send.test123@mail.ru', 'Test'); // Адрес самой почты и имя отправителя
    // Получатель письма
    // $mail->addAddress('welcome@trinitygroup.ru');
    $mail->addAddress('yakipchik@gmail.com');
    // Отправка сообщения
    $mail->isHTML(true);
    $mail->Subject = $title;
    $mail->Body = $body;
    // Проверяем отравленность сообщения
    if ($mail->send()) {
        $result = "success";
    } else {
        $result = "error";
    }
} catch (Exception $e) {
    $result = "error";
    $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}
// Отображение результата
echo json_encode(["result" => $result, "status" => $status]);