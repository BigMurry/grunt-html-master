## grunt-html-master
> build html page by using master page.

### master.html
```html
<!DOCTYPE html>
<html>
<head></head>
<body>
<div class="container">
  <div class="header">
  <!-- masterify:tag header -->
  </div>
  <div class="main-content">
  <!-- masterify:tag content -->
  </div>
  <div class="footer">
  <!-- masterify:tag footer -->
  </div>
</div>
</body>
</html>

### page.html
```html
<!-- masterify:master master1 --><!-- /masterify ->

<!-- masterify:fortag header -->
<div>
  <p> This is the content of header.</p>
</div>
<!-- /masterify -->

<!-- masterify:fortag content -->
<p> This is the content of the content.</p>
<!-- /masterify -->

<!-- masterify:fortag footer -->
<p>This is the content of the footer</p>
<!-- /masterify -->

### result.html
```html
<!DOCTYPE html>
<html>
<head></head>
<body>
<div class="container">
  <div class="header">
    <div>
      <p> This is the content of header.</p>
    </div>
  </div>
  <div class="main-content">
    <p> This is the content of the content.</p>
  </div>
  <div class="footer">
    <p>This is the content of the footer</p>
  </div>
</div>
</body>
</html>
