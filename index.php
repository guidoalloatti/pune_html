<?php

  $header 			= file_get_contents("./templates/head.html");
  $nav_bar 			= file_get_contents("./templates/nav_bar.html");
  $start_screen = file_get_contents("./templates/start_screen.html");
  $game_canvas 	= file_get_contents("./templates/game_canvas.html");
  $game_details = file_get_contents("./templates/game_details.html");
  $footer 			= file_get_contents("./templates/footer.html");

  $html = $header.
          $nav_bar.
          $start_screen.
          $game_canvas.
          $game_details.
          $footer;

  echo $html;

?>