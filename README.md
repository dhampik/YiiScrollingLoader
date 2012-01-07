Welcome to YiiScrollingLoader (v0.0.1 - January 7 2012)
==================


This extension could be used together with CListView YII framework component and forces it to
load content on window scroll similar to twitter autoloading feature.

Licensed under the [New BSD License](http://opensource.org/licenses/BSD-3-Clause)
Copyright 2011 [Kirill Kalachev aka dhampik]


## Usage

### Example of usage
``` php
<?Yii::app()->clientScript->registerCoreScript('jquery')?>
<?Yii::app()->clientScript->registerScriptFile('/js/yii.scrolling.loader.js')?>
<?Yii::app()->clientScript->registerScript('yii.scrolling.loader', "$('#sample-list').yiiScrollingLoader();", CClientScript::POS_READY)?>
<script type='text/javascript'>document.write("<style>#sample-list .pager{display: none;}</style>");</script>

<?$this->widget('zii.widgets.CListView', array(
	'id' => 'sample-list',
	'dataProvider' => $model->search(),
	'template'=>'{pager} {items} {pager}',
	'itemView' => '_view',
));?>
```


## Changelog

- v0.0.1 - January 07 2012
	- Basic version