

(function($, window, undefined){

	var methods = {

		/**
		 * Initialize Yii Scrolling Loader js plugin
		 * @param options
		 */
		'init': function(options) {
			return this.each(function () {

				var $this = $(this),
					data = $this.data('YiiScrollingLoader');

				// If plugin was not initialized yet
				if ( ! data ) {

					$(function () {
						var currentPage = 0,
							lastPage = 0;

						// Hiding paging in case if javascript is enabled
						// better to do it earlier and inline the following code to HTML
						// <script type="text/javascript">document.write('<style type="text/css">.pager{display: none;}</style>');</script>
						var $pagers = $this.find('.pager').css('display', 'none');
						// Using one of the pagers to count pages
						// Pagers should be enabled for ListView
						var $pager = $pagers.length > 0 ? $($pagers[0]) : undefined;

						// Identify current page and last page in the range (this might not be the very last page)
						if ($pager !== undefined) {
							var $pages = $pager.find('.page');
							lastPage = +$pages.filter(':last').find('a').html();
							currentPage = +$pages.filter('.selected').find('a').html();
						}

						$this.data('YiiScrollingLoader', {
							target : $this,
							currentPage : currentPage,
							lastPage: lastPage,
							currentRequest: undefined,
							nextPageUrl: (options == undefined ? undefined : options.nextPageUrl),
							loadCallback: (options == undefined ? undefined : options.loadCallback)
						});

					});

					$this.append('<div id="loading"></div>');

					// Handling window scrolling
					$(window).scroll(function () {

						var data = $this.data('YiiScrollingLoader');

						// If scrolled to the bottom of the page and nothing is loaded now
						if (isScrolledBottom($this) && (data.currentRequest === undefined)) {
							loadMore($this);
						}

					});

				}
			});
		},

		/**
		 * Reload data with new params
		 * @param options
		 */
		'reload': function(options) {

			if ((options == undefined) || (options.nextPageUrl == undefined)) {
				throw new Error("YiiScrollingLoader('reload'): options are required!");
			}

			return this.each(function () {
				var $this = $(this);
				var data = $this.data('YiiScrollingLoader');

				if (data.currentRequest != undefined) {
					data.currentRequest.abort();
				}

				$this.empty();
				$this.append('<div class="items"></div>');
				$this.append('<div id="loading"></div>');

				$this.data('YiiScrollingLoader', {
					target : $this,
					currentPage : 0,
					lastPage: 1,
					currentRequest: undefined,
					nextPageUrl: options.nextPageUrl,
					loadCallback: options.loadCallback
				});

				loadMore($this);
			});
		}
	};

	$.fn.yiiScrollingLoader = function(method) {

		if ( methods[method] ) {
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on $.yiiScrollingLoader' );
		}

	};

	function isScrolledBottom($this) {
		return ($(window).scrollTop() >= ($this.offset().top + $this.outerHeight() - $(window).height()));
	}

	function loadMore($this) {

		var data = $this.data('YiiScrollingLoader');

		if ((data.currentRequest == undefined) && data.currentPage < data.lastPage) {
			$('#loading').show();

			var url = data.nextPageUrl;

			if (url == undefined) {
				url = $this.find('.pager:first').find('.page.selected + .page').find('a').attr('href');
			}

			if (url != undefined) {
				data.currentRequest = $.get(url)
					.success(function (response) {
						data.currentRequest = undefined;

						var $listView = $('#' + $this.prop('id'), $(response));

						var $pagers = $listView.find(".pager");
						var $pager = $pagers.length > 0 ? $($pagers[0]) : undefined;
						if ($pager !== undefined) {
							var $pages = $pager.find('.page');
							data.lastPage = +$pages.filter(':last').find('a').html();
							data.currentPage = +$pages.filter('.selected').find('a').html();
							data.nextPageUrl = $pages.filter('.selected + .page').find('a').attr('href');
						} else {
							data.lastPage = 0;
							data.currentPage = 0;
							data.nextPageUrl = undefined;
						}

						$this.data('YiiScrollingLoader', data);

						$(".items").append($listView.find(".items").html());
						$('#loading').hide();

						var itemsIds = [];
						$listView.find(".keys span").each(function() {
							itemsIds.push(this.innerHTML);
						});

						if (data.loadCallback != undefined) {
							data.loadCallback($this, itemsIds);
						}

						// If we are at the bottom of the page, then load more items again
						if (isScrolledBottom($this)) {
							loadMore($this);
						}
					})
					.error(function () {
						data.currentRequest = undefined;
						$this.data('YiiScrollingLoader', data);
					});

				$this.data('YiiScrollingLoader', data);
			}
		}
	}
})(jQuery, window);