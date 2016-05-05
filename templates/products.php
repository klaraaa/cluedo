<div id="donutList">
  <ul>
    <h2>
      <span>O</span>
      <span>R</span>
      <span>D</span>
      <span>E</span>
      <span>R</span>
    </h2>
  <?php
  	// Loop through json objects and create order input forms
  	$json = file_get_contents('../json/products.json');
  	$products = json_decode($json, true);
    $form = "";
  	foreach ($products["donuts"] as $donut) {
      $form .= "<li><p>".$donut['flavor'].", ".$donut['price']." kr/st. Antal: </p>
      <input type='number' data-price='".$donut['price']."' name='antal' id='antal'></li>
      ";
  	}
    $form .= "<br><input type='submit' id='order'></input>";
    echo $form;
  ?>
  </ul>
</div>
<div id="cost">
  <p id="sum"></p>
</div>

<script type="text/javascript">
  /**
  * Updates tot cost if inputs are changed
  **/
  $('input').change(function() {
    tot += parseInt($(this).val()) * parseInt($(this).data('price'));
    $('#sum').html('Total summa är: ' + tot + ' kr.');
  });

  $(document).ready(function() {
    $('#order').on('click', function(e) {
      alert('Skickat! Summa att betala: ' + tot + ' kr.');
    });
  });
</script>
