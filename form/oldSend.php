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
