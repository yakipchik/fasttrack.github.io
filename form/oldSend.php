<?php
// Несколько получателей
$to = 'yakipchik@gmail.com'; // Обратите внимание на запятую

// Тема письма
$subject = 'Subject';

// Текст письма
$message = '
<html>
<head>
  <title>Birthday Reminders for August</title>
</head>
<body>
  <p>Here are the birthdays upcoming in August!</p>
  <table>
    <tr>
      <th>Person</th><th>Day</th><th>Month</th><th>Year</th>
    </tr>
    <tr>
      <td>Johny</td><td>10th</td><td>August</td><td>1970</td>
    </tr>
    <tr>
      <td>Sally</td><td>17th</td><td>August</td><td>1973</td>
    </tr>
  </table>
</body>
</html>
';

// Для отправки HTML-письма должен быть установлен заголовок Content-type
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=iso-8859-1';

// Дополнительные заголовки
$headers[] = 'To: Yakipchik <yakipchik@gmail.com>';
$headers[] = 'From: Welcome trinity <welcome@trinity.ru>';

// Отправляем
mail($to, $subject, $message, implode("\r\n", $headers));

echo json_encode(["result" => 'success']);


//$bodyasd = "
//<div style='max-width: 700px; margin: 0; border-radius: 5px; border: 1px solid #e9e9e9;padding: 10px;'>
//<h2 style='font-size: 28px; margin: 0 0 5px 0; padding: 10px; border-bottom: 1px solid #e9e9e9;'>Обратная связь</h2>
//$allText
//</div>
//";

//$allText = '';
//$name = $_POST['name'] ?? null;
//$phone = $_POST['phone'] ?? null;
//$mail = $_POST['mail'] ?? null;
//$company = $_POST['company'] ?? null;
//$comment = $_POST['comment'] ?? null;

//if (!empty($name)) {
//    $allText .= "<p style='font-size: 16px;'><b>Фамилия и имя:</b> $name</p>";
//}
//if (!empty($phone)) {
//    $allText .= "<p style='font-size: 16px;'><b>Телефон:</b> $phone</p>";
//}
//if (!empty($mail)) {
//    $allText .= "<p style='font-size: 16px;'><b>Email:</b> $mail</p>";
//}
//if (!empty($company)) {
//    $allText .= "<p style='font-size: 16px;'><b>Компания:</b> $company</p>";
//}
//if (!empty($comment)) {
//    $allText .= "<p style='font-size: 16px;'><b>Вопрос или комментарий к заявке:</b> $comment</p>";
//}