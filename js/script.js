var body_var,
    $doc,
    $order_form,
    global_window_Height,
    products,
    curProduct = 0,
    curPrice = 0,
    curView = 0,
    curColor = 0,
    curColorCount = 1,
    costs,
    views,
    colors,
    preloaderHolder,
    prodCounterVal,
    navigation_links,
    sections,
    headerMenuMarker,
    otherProdSlider,
    reviewsSlider,
    benefitsSlider,
    clientsSlider,
    mainMenuSlider;

$(function ($) {

    $doc = $(document);
    body_var = $('body');
    headerMenuMarker = $('.headerMenuMarker');
    preloaderHolder = $('.preloaderHolder');

    navigation_links = $(".menuLink");
    sections = $(".sectionWP");

    updateProdCounterVal();

    var header = $('.header'),
        browserWindow = $(window);

    if ($("#order_form").length) {

        $order_form = $("#order_form").dialog({
            autoOpen: false,
            modal: true,
            closeOnEscape: true,
            closeText: '',
            show: "fade",
            position: {my: "center center", at: "center center", of: window},
            draggable: true,
            dialogClass: 'dialog_global dialog_g_size_1 dialog_close_butt_mod_1 title_center_mod dialog_butt_v1',
            width: 410,
            open: function (event, ui) {
                $(event.target).prev('.ui-dialog-titlebar').find('.ui-dialog-title').text($('.productUnit .order_caption').text());
            },
            close: function (event, ui) {

            }
        });
    }

    body_var.delegate('.colorSwitchCheck', 'change', function () {
        updateProdCounterVal();
    }).delegate('#mock_counter', 'change', function () {
        updateProdCounterVal();
    }).delegate('#prod_counter', 'change keyup', function () {
        updateProdPrice();
    }).delegate('.increaseVal', 'keypress', function (event) {

        //var code = (event.which) ? event.which : event.keyCode;
        //
        //console.log(event.which, event.keyCode, event);
        //
        //
        //return (event.charCode >= 48 && event.charCode <= 57) || (event.keyCode >= 37 && event.keyCode <= 40 ) || event.keyCode == 8 || event.keyCode == 46;

        return (event.charCode >= 48 && event.charCode <= 57);

    }).delegate('.increaseVal', 'keyup', function (event) {
        var val = $(this);

        val.val(val.val().replace(/^0+/, ''));

        if (val.val().length == 0) val.val(1);

        updateProdPrice();


    }).delegate('.increaseBtn', 'click', function () {
        var firedEl = $(this), inp = firedEl.closest('.increaseBox').find('.increaseVal');

        inp.val(parseInt(inp.val()) + 1);

        updateProdPrice();

        return false;
    }).delegate('.decreaseBtn', 'click', function () {
        var firedEl = $(this), inp = firedEl.closest('.increaseBox').find('.increaseVal');

        inp.val(Math.max(1, parseInt(inp.val()) - 1));

        updateProdPrice();

        return false;
    }).delegate('.otherProductBtn', 'click', function () {
        var firedEl = $(this).closest('.swiper-slide');

        curProduct = (firedEl.attr('data-prod-id') * 1) - 1;

        firedEl.addClass('active_product').siblings().removeClass('active_product');

        otherProdSlider.update();

        loadProduct();

        updateProdCounterVal();

        return false;
    }).delegate('.viewSwapCheck', 'change', function () {
        updateProdCounterVal();
    }).delegate('.orderBtn', 'click', function () {

        $('.popupCount').text(prodCounterVal);
        $('.popupPrice').text(priceFormat(curPrice));
        $('.popupTotal').text(priceFormat(curPrice * prodCounterVal));

        $order_form.dialog('open');

        return false;
    });

    initMask();

    $('.validateMe').validationEngine({
        scroll: false,
        showPrompts: true,
        showArrow: false,
        addSuccessCssClassToField: 'success',
        addFailureCssClassToField: 'error',
        parentFormClass: '.orderForm',
        parentFieldClass: '.formCell',
        promptPosition: "centerRight",
        autoHidePrompt: true,
        autoHideDelay: 2000000,
        autoPositionUpdate: true,
        addPromptClass: 'relative_mode',
        showOneMessage: false
    });

    all_dialog_close();

    productParser();

});

function initMask() {
    $("input").filter(function (i, el) {
        return $(el).attr('data-inputmask') != void 0;
    }).inputmask();
}

function loadProduct() {

    preloaderHolder.fadeIn();

    var prodForm = $('.prodForm').empty();

    var item = products[curProduct];

    costs = item.costs;
    views = item.views;
    colors = item.colors;

    curPrice = getPriceForCount(costs);

    var colorsHTML = ' <ul class="product_colors">';

    for (var j = 0; j < colors.length; j++) {
        colorsHTML +=
            ' <li class="colorSwitch">' +
            '   <label class="check_emul check_v1"> ' +
            '    <input type="radio" name="prod_color" class="check_inp colorSwitchCheck" ' +
            (j === 0 ? 'checked="checked" ' : '') + '>' +
            '    <span class="check_text" style="background: ' + colors[j] + ';"></span>' +
            '   </label>' +
            ' </li> ';
    }

    colorsHTML += '</ul>';

    var imageSwapHTML = '<ul class="product_image_swap productImageSwap"></ul>';

    //for (var j = 0; j < views.length; j++) {
    //    imageSwapHTML +=
    //        '<li class="viewSwapItem">' +
    //        '   <label class="view_btn">' +
    //        '      <input type="radio" name="prod_view" class="check_inp viewSwapCheck" ' +
    //        (j === 0 ? 'checked="checked" ' : '') + '>' +
    //        '      <div class="check_text"><img src="' + views[j].small[0] + '"></div>' +
    //        '   </label>' +
    //        '</li>';
    //}

    //imageSwapHTML += '</ul>';

    var colorCounterHTML = '<select id="mock_counter" class="select2"> ';

    for (var j = 0; j < costs.length; j++) {
        colorCounterHTML += ' <option>' + costs[j].colorCount + '</option>';
    }

    colorCounterHTML += '</select>';

    var productInfoHTML = item.info;

    var itemHTML = $(' <div class="productUnit product_unit">' +
        '             <h2 class="gl_caption order_caption">' + item.title + '</h2>  ' +
        '             <div class="product_image_holder">' +
        '                 <div class="product_image">' +
        '                   <img class="prodImg" title="' + views[0].title +
        '" src=""> ' +
        colorsHTML +
        '                 </div> ' +
        imageSwapHTML +
        '               </div>' +
        '               <div class="product_features">' +
        '                 <div class="product_settings">' +
        '                   <div class="form_row mob_center form_cell_v1 form_label_v1">' +
        '                     <div class="form_cell mob_mr25">' +
        '                       <label for="prod_counter" class="form_label">Количество:</label>' +
        '                       <div class="f_cell_inner">' +
        '                         <div class="input_w increase_box increaseBox w_82">' +
        '                           <input id="prod_counter" value="' +
        prodCounterVal +
        '" class="f_input input_v1 increaseVal" data-inputmask="\'mask\': \'99999\', \'placeholder\': \'\'"> ' +
        '                           <span class="counter_btn increase_btn increaseBtn">+</span>' +
        '                           <span class="counter_btn decrease_btn decreaseBtn">-</span>' +
        '                         </div>' +
        '                           <span class="mb f_cell_measure">шт.</span>' +
        '                       </div>' +
        '                     </div>' +
        '                     <div class="form_cell">' +
        '                       <label for="mock_counter" class="form_label">Макет:</label>' +
        '                       <div class="f_cell_inner">' +
        '                         <div class="input_w w_54 select_v1">' +
        colorCounterHTML +
        '                         </div>' +
        '                           <span class="mb f_cell_measure">цветов.</span>' +
        '                       </div>' +
        '                     </div>' +
        '                   </div>' +
        '                   <div class="form_row mob_center">' +
        '                     <div class="product_price">' +
        '                       <span class="fw_b productPriceVal product_price_val">' +
        curPrice +
        ' </span>' +
        '                       <span> руб/шт.</span></div>' +
        '                   </div>' +
        '                 </div>' +
        '                 <div class="product_total_block">' +
        '                   <div class="product_total">' +
        '                     <div class="mb"><span class="fw_b">Итого: </span></div>' +
        '                     <div class="mb product_total_price">' +
        '                       <span class="fw_b totalPriceVal">' +
        priceFormat(curPrice * prodCounterVal) +
        '</span>' +
        '                       <span class="fz_30">руб.</span>' +
        '                     </div>' +
        '                   </div>' +
        '                   <div class="product_controls">' +
        '                     <button class="btn_v1 btn_blue order_btn orderBtn">' +
        '                       <span class="mb">Отправить заявку</span>' +
        '                       </button>' +
        '                   </div>' +
        '                 </div>' +

        productInfoHTML +

        '               </div>' +
        '             </div>');

    prodForm.append(itemHTML);

    updateProdPrice();

    loadImageSwaper();

    initMask();

    initSelect();

}

function loadImageSwaper() {

    var productImageSwap = $('.productImageSwap').empty();

    for (var j = 0; j < views.length; j++) {
        var imageSwapItem =
            $('<li class="viewSwapItem">' +
                '   <label class="view_btn">' +
                '      <input type="radio" name="prod_view" class="check_inp viewSwapCheck" ' +
                (j === curView ? 'checked="checked" ' : '') + '>' +
                '      <div class="check_text"><img src="' + views[j].small[curColor] + '"></div>' +
                '   </label>' +
                '</li>');

        productImageSwap.append(imageSwapItem);
    }
}
function updateProdCounterVal() {

    updateProdPrice();
}

function updateProdPrice() {

    curColor = $('.colorSwitchCheck:checked').closest('.colorSwitch').index();

    curView = $('.viewSwapCheck:checked').closest('.viewSwapItem').index();

    curView = Math.max(curView, 0);

    curColorCount = parseInt($('#mock_counter').val());

    prodCounterVal = parseInt(($('#prod_counter').val()).toString().replace(/\D/, ''));

    if (costs != void 0) {
        curPrice = getPriceForCount(costs);

        $('.productPriceVal').text(curPrice);
        $('.totalPriceVal').text(priceFormat(curPrice * prodCounterVal));
    }

    if (views != void 0) {
        $('.prodImg').attr('src', views[curView].big[curColor]).one('load', function () {
            preloaderHolder.fadeOut();
        });

        loadImageSwaper();
    }

}

function initSelect() {

    $('.select2').each(function (ind) {
        var $slct = $(this), cls = $slct.attr('data-select-class') || '';

        $slct.select2({
            minimumResultsForSearch: Infinity,
            width: '100%',
            //containerCssClass: cls,
            adaptDropdownCssClass: function (c) {
                return cls;
            }
        });
    });
}

function getPriceForCount(arr) {

    for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];


        if (curColorCount == obj.colorCount) {

            for (var j = 0; j < obj.prices.length - 1; j++) {
                var maxCount = obj.prices[j].maxCount;

                if (prodCounterVal <= obj.prices[j].maxCount) {

                    if (j === 0) {
                        return parseInt(obj.prices[j].cost);
                    }

                } else {
                    if (prodCounterVal <= obj.prices[j + 1].maxCount) {
                        return parseInt(obj.prices[j + 1].cost);
                    }
                }
            }

            return parseInt(obj.prices[obj.prices.length - 1].cost);
        }
    }
}

function priceFormat(int) {
    return (int).toString().replace(/(?!^)(?=(\d{3})+(?=\.|$))/gm, ' ');
}

function getProdMinPrice(prod_costs) {
    var minPrice = prod_costs[0].prices[0].cost * 1;

    for (var i = 0; i < prod_costs.length; i++) {
        var cost = prod_costs[i].prices;

        for (var j = 0; j < cost.length; j++) {
            var obj = cost[j];
            minPrice = Math.min(minPrice, obj.cost * 1);
        }
    }

    return minPrice;

}

function productParser() {

    var jsonURL = "jsonSchema3.json";

    $.getJSON(jsonURL, {
            format: "json"
        })
        .done(function (data) {
            products = data.products;

            curColorCount = parseInt($('#mock_counter').val());

            var otherProdsHTML = '<div id="other_prod_next" class="swiper-btn swiper-next"></div><div id="other_prod_prev" class="swiper-btn swiper-prev"></div> <div class="otherProdSlider swiper-container"><ul class="swiper-wrapper">';

            $.each(products, function (i, item) {

                otherProdsHTML +=
                    '<li class="swiper-slide' + (i === curView ? ' active_product' : '') + '" data-prod-id="' +
                    item.id + '">' +
                    '   <a href="#" class="other_product otherProductBtn"> ' +
                    '       <div class="other_product_img">' +
                    '           <img src="' +
                    (item.views[0].small[0] || "") +
                    '">' +
                    '       </div>' +
                    '       <div class="other_product_name">'
                    + item.title +
                    '       </div>' +
                    '       <div class="other_product_price mob_hidden fw_b"> от <span class="other_product_price_val">' +
                    getProdMinPrice(item.costs) +
                    ' </span> руб/шт. ' +
                    '       </div>' +
                    '   </a>' +
                    '</li>'

            });

            otherProdsHTML += '</ul></div>';

            $('.otherProductsSlider').html(otherProdsHTML);

            otherProdSlider = new Swiper('.otherProdSlider', {
                // Optional parameters
                loop: true,
                initialSlide: 0,
                freeMode: true,
                setWrapperSize: true,
                slidesPerView: 'auto',
                nextButton: '#other_prod_next',
                prevButton: '#other_prod_prev',
                spaceBetween: 0,
                onInit: function (swp) {

                }
            });

            loadProduct();

        });

}

$(window).on('load', function () {

    mainMenuSlider = new Swiper('.mainMenuSlider', {
        // Optional parameters
        loop: false,
        initialSlide: 0,
        freeMode: true,
        setWrapperSize: true,
        resizeReInit: true,
        slidesPerView: 'auto',
        slideClass: 'menu_item',
        spaceBetween: 0,
        onInit: function (swp) {
            waypoints();
        }
    });

    reviewsSlider = new Swiper('.reviewsSlider', {
        // Optional parameters
        loop: true,
        initialSlide: 0,
        setWrapperSize: true,
        slidesPerView: 1,
        nextButton: '#review_next',
        prevButton: '#review_prev',
        spaceBetween: 0,
        onInit: function (swp) {

        }
    });

    benefitsSlider = new Swiper('.benefitsSlider', {
        // Optional parameters
        loop: false,
        initialSlide: 0,
        setWrapperSize: true,
        nextButton: '#benefit_next',
        prevButton: '#benefit_prev',
        spaceBetween: 0,
        slidesPerView: 4,
        forceHeight: true,
        onInit: function (swp) {
            //updateSlideHeight();
        },
        // Responsive breakpoints
        breakpoints: {

            1000: {
                loop: true,
                slidesPerView: 3,
                spaceBetween: 20
            },

            820: {
                loop: true,
                slidesPerView: 2
            },

            640: {
                loop: true,
                slidesPerView: 1
            }
        }
    });

    clientsSlider = new Swiper('.clientsSlider', {
        // Optional parameters
        loop: true,
        initialSlide: 0,
        setWrapperSize: true,
        nextButton: '#client_next',
        prevButton: '#client_prev',
        slideClass: 'client_t_cell',
        spaceBetween: 85,
        slidesPerView: 5,
        onInit: function (swp) {

        },
        // Responsive breakpoints
        breakpoints: {

            1000: {
                slidesPerView: 4,
                spaceBetween: 60
            },

            820: {
                slidesPerView: 3,
                spaceBetween: 40
            },

            640: {
                slidesPerView: 2,
                spaceBetween: 20
            },

            420: {
                slidesPerView: 1,
                spaceBetween: 20
            }
        }
    });


}).on('resize', function () {

    $(mainMenuSlider.wrapper).css('width', 'auto');

    mainMenuSlider.update();

    //updateSlideHeight();

}).on('scroll', function () {

    if (body_var && headerMenuMarker) {
        body_var.toggleClass('menu_fixed', $(document).scrollTop() >= headerMenuMarker.offset().top);
    }

});

function updateSlideHeight() {


    var maxH = 0, slides = $('.benefitsSlider .swiper-wrapper .swiper-slide');

    slides.css('height', 'auto').each(function (ind) {

        maxH = Math.max(maxH, $(this).outerHeight());

    });

    setTimeout(function () {
        slides.css('height', maxH);
    }, 0);

    console.log(maxH);

}

function all_dialog_close() {
    body_var.on('click', '.ui-widget-overlay', all_dialog_close_gl);
}

function all_dialog_close_gl() {
    $(".ui-dialog-content").each(function () {
        var $this = $(this);
        if (!$this.parent().hasClass('always_open')) {
            $this.dialog("close");
        }
    });
}

function waypoints() {

    navigation_links.click(function (event) {

        var firedEl = $(this), section_target = $(firedEl.attr('href'));

        navigation_links.parent().removeClass('active');

        if (section_target != void 0) {
            scrollDoc(parseInt(section_target.offset().top - section_target.css('padding-top').replace('px', '') * 1), 1000, function () {
                setTimeout(function () {
                    navigation_links.parent().removeClass('active');
                    firedEl.parent().addClass('active');
                }, 1);
            });
        }

        return false;
    });

    sections.waypoint({
        handler: function (event, direction) {

            var active_section = $(this);

            if (direction === "up") active_section = active_section.prev();

            var active_link = navigation_links.filter(function (e, r) {
                return $(this).attr('href') == '#' + active_section.attr("id");
            });

            navigation_links.parent().removeClass("active");
            active_link.parent().addClass("active");

        },
        offset: 60
    })
}

function scrollDoc(pos, speed, callback) {

    $('html,body').animate({'scrollTop': pos}, speed, function () {
        if (typeof(callback) == 'function') {
            callback();
        }
    });

}