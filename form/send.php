<?php

require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

$allText = '';
$name = $_POST['name'] ?? null;
$phone = $_POST['phone'] ?? null;
$mail = $_POST['mail'] ?? null;
$company = $_POST['company'] ?? null;
$comment = $_POST['comment'] ?? null;

if (!empty($name)) {
    $allText .= "<p style='font-size: 16px;'><b>Фамилия и имя:</b> $name</p>";
}
if (!empty($phone)) {
    $allText .= "<p style='font-size: 16px;'><b>Телефон:</b> $phone</p>";
}
if (!empty($mail)) {
    $allText .= "<p style='font-size: 16px;'><b>Email:</b> $mail</p>";
}
if (!empty($company)) {
    $allText .= "<p style='font-size: 16px;'><b>Компания:</b> $company</p>";
}
if (!empty($comment)) {
    $allText .= "<p style='font-size: 16px;'><b>Вопрос или комментарий к заявке:</b> $comment</p>";
}
// Формирование самого письма
$title = "Обратная связь";
$body = "
<div style='max-width: 700px; margin: 0; border-radius: 5px; border: 1px solid #e9e9e9;padding: 10px;'>
<h2 style='font-size: 28px; margin: 0 0 5px 0; padding: 10px; border-bottom: 1px solid #e9e9e9;'>Обратная связь</h2>
$allText
</div>
";
// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer(true);
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
echo json_encode(
    [
        "result" => $result,
        "mail" => $mail
    ]
);