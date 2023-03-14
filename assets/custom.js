
// if(window.localStorage.getItem('products_data')){
//     var saved_data = window.localStorage.getItem('products_data');
//     saved_data = JSON.parse(saved_data);
// }else{
    var saved_data = {};
// }

$(document).ready(function () {
    loadColorSwatches();



    $(document).on('click','.gallery-cell .arrow-button',function (e) { 
        const container = $(this).closest('.gallery-cell').find('.color-swatch-container .selected').closest('.color-swatch-container');
        const images = JSON.parse(container.find('script').html().trim()).images;
        const image__wrapper = $(this).closest('.gallery-cell').find('.image-element__wrap');
        const current_image = image__wrapper.find('img');
        const index = parseInt(current_image.attr('data-index') !== undefined ? current_image.attr('data-index') : 0);
        let new_image = '';
        let new_image_index = 0;

        if( $(this).closest('.gallery-cell').find('.ui-effects-wrapper').length > 0){
            $(this).closest('.gallery-cell').find('.ui-effects-wrapper').remove(); 
        }

        if($(this).hasClass('arrow-button-left')){
            if(index === 0){
                 new_image = images[images.length - 1];
                new_image_index = images.length - 1
            }
            else{
                 new_image = images[index - 1];
                 new_image_index= index - 1;
            }
        }else if ($(this).hasClass('arrow-button-right')){
           if (index === images.length - 1){
               new_image = images[0];
               new_image_index = 0;
           }
           else{
                new_image = images[index + 1];
                new_image_index= index + 1;
           }
        }

        new_image = new_image.split('.jpg')[0] + '_400x.jpg' + new_image.split('.jpg')[1];
        image__wrapper.append(`<img class="new_image" data-index=${new_image_index} style="display:none;" src=${new_image}>`);
        current_image.css('position','absolute');
        image__wrapper.css('height',current_image.innerHeight());
        image__wrapper.css('width',current_image.innerWidth());
        current_image.css('top',0);
        current_image.css('left',0);

        if($(this).hasClass('arrow-button-left')){
            setTimeout(() => {
                current_image.hide("slide", {
                    direction: "right"
                }, 500);
                image__wrapper.find('.new_image').show("slide", {
                    direction: "left"
                }, 500);
            }, 100);

        }else if ($(this).hasClass('arrow-button-right')){
            setTimeout(() => {
                current_image.hide("slide", {
                    direction: "left"
                }, 500);
                image__wrapper.find('.new_image').show("slide", {
                    direction: "right"
                }, 500);
            }, 200);
        }

        setTimeout(() => {
            current_image.remove(); 
        }, 500);
    });
    $(document).on('click','.gallery-cell .arrow-button-right',function () {  
        // const data = JSON.parse(target.find('script').text());
    });
    
    $(document).on('click','.gallery-cell .color-swatch-container, .quick-shop__popup .color-swatch-container',function (e) {  
        e.preventDefault();
        setTimeout(() => {
            $(this).closest('.color-swatches').find('.selected').removeClass('selected');
            $(this).find('.color-swatch').addClass('selected');
            updateProductGrid($(this));
        }, 200);
    });

    $(document).on('click','.quick-shop__popup .swatch__option',function (e) {  
        setTimeout(() => {
            const value = $(this).find('input').val();
            $('[data-variant-option-chosen-value]').attr('data-variant-option-chosen-value', value);
            $('.quick-shop__popup .variant-selection__variants option').each(function () {  
                const val = $(this).text().trim();
                if(val.indexOf(value) > -1){
                    $(this).prop('selected', true);
                return;
    
                }
            });
        }, 200);
    });
    
    $(document).on('click','.quick-shop__popup .fs-images-bar-container img',function (e) {  
        var img_url = $(this).attr('src');

        $('.quick-shop__popup a.quick-view-dialog-image img').attr('src',img_url)
    });

    var mediaQuery = window.matchMedia('(min-width: 799px)');
    
    if(mediaQuery.matches){
        $(document).on('mouseover','.gallery-cell .color-swatches .color-swatch-container',function () {  
            setTimeout(() => {
                updateProductGrid($(this));
            }, 200);
        });
        $(document).on('mouseover','.gallery-cell',function () {  

            showOptions($(this));
        });
        $(document).on('mouseleave','.gallery-cell',function () {  
            const elem =  $(this).find('.custom_fs_options_wrapper');
            removeOptions(elem);
        });
        $(document).on('click','.gallery-cell .custom_fs_options_wrapper .option.available',function () {  
            $('.gallery-cell').unbind('mouseover');
            const data = {
                "id": $(this).attr('data-id'),
                "quantity": 1
            };
            const container = $(this).closest('.custom_fs_options_wrapper');
            
            container.find('.options').remove();
    
            container.addClass('option-wrapper-on-add');
            container.append('<svg height="30" width="30" style="animation-duration: 550ms;" class="svelte-spinner fs-result-page-n2keu2" viewBox="0 0 32 32"><circle role="presentation" cx="16" cy="16" r="10" stroke="black" fill="none" stroke-width="2" stroke-dasharray="47.12388980384689,100" stroke-linecap="round"></circle></svg>');
    
            jQuery.ajax({
                type: 'POST',
                url: '/cart/add.js',
                data: data,
                dataType: 'json',
                success: function() { 
                    // Update cart icon count
                    $('.header-cart__count').each(function () {  
                        var current_count = parseInt($(this).text());
                        $(this).text(current_count + 1);
                        $(this).closest('.action-area__link').addClass('has-cart-count');
                    })
                    PXUTheme.jsAjaxCart.showDrawer();
                    PXUTheme.jsAjaxCart.updateView();
                    container.find('svg').remove();
                    container.append('<svg width="21" height="21" fill="black" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>');
                    setTimeout(() => {
                        removeOptions(container);
                        $('.gallery-cell').mouseover(function () {  
                            showOptions($(this));
                        });
                    }, 800);
       
                }
              });
        });
    }

});

function loadColorSwatches() { 
    $('.featured-collection-section, .recommended-products-section').each(function (index) {  
        if($(this).hasClass('swatches_loading') || $(this).hasClass('swatches_loaded')){
            return;
        }
        if(inToView($(this))){
            $(this).find('.product-wrap').each(function () {  
                buildColorSwatches($(this));
            });
        }else{
            var _this = $(this);
            setTimeout(() => {
                if(_this.hasClass('swatches_loading') || _this.hasClass('swatches_loaded')){
                    return;
                }
                _this.find('.product-wrap').each(function () {  
                    buildColorSwatches($(this));
                });
            }, 1000*(index+1));
        }
    });

    $(document).scroll(function () { 
        $('.featured-collection-section, .recommended-products-section').each(function () {  
            if($(this).hasClass('swatches_loading') || $(this).hasClass('swatches_loaded')){
                return;
            }
            if(inToView($(this))){
                $(this).find('.product-wrap').each(function () {  
                    buildColorSwatches($(this));
                });
            }
        })
    }); 

    function inToView(target) {  
        var elementTop =target.offset().top;
        var elementBottom = elementTop + target.outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        // console.log(elementBottom > viewportTop && elementTop < viewportBottom, target);
        return elementBottom > viewportTop && elementTop < viewportBottom;
    };
};

function buildColorSwatches(target) {  
    if(target.find('fieldset.swatch.color').length>0){
        return;
    }
    target.closest('.shopify-section').addClass('swatches_loading');
    const url = target.find(".product-thumbnail__title").attr('href');
    if(url && url !== "undefined"){
    setTimeout(() => {
        renderSectionFromFetch(target,url);
      }, 400);
    }
}

function renderSectionFromFetch(target,url) {  
    if(saved_data && saved_data[url]){
        let html = saved_data[url];
        const product_swacthes =  $(html).find('.swatch.color').html()
        renderMoreColors(url,target,product_swacthes);
    }else{
      window.PXUTheme.jsProductClass.load(url).then(({
        html
      }) => {
       saved_data[url] = $(html.content).find('.product_form').html();
       const product_swacthes =  $(html.content).find('.product_form .swatch.color').html()
       renderMoreColors(url,target,product_swacthes);
    //    window.localStorage.setItem('products_data', JSON.stringify(saved_data))
      }).catch(error => {  
        console.log(error);
        target.closest('.shopify-section').removeClass('swatches_loading');
      });
    }

    function renderMoreColors(url,target,responseText) {  
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        const more_colors_count = $(html).find('.color-swatch-container').length;
        let color_swatches = '';
        $(html).find('.color-swatch-container').each(function (index) {  
            if(index < 4){
                color_swatches += `<span class="color-swatch-container fs-color-swatch-container">
                ${$(this).html()}
                </span>
                `
            }
        });
        let quickshop = '';
        if(more_colors_count > 4){
            quickshop = `<div class="quick-shop__buttons animated fadeInUp">
            <span class="quick_shop button action_button js-quick-shop-link"
              data-url="${url}"
            >
            +${more_colors_count - 4}
            </span>
        </div>`;
        }
        let color_html = `<fieldset class="swatch color">
        <legend class="option-title label">
        <div class="color-swatches fs-result-page-1xgbzd0">
        ${color_swatches}
        ${quickshop}
        </div>
        </legend>
        </fieldset>`;
        $(color_html).insertAfter(target.find('.product-thumbnail__price'));

        $(target).closest('.shopify-section').addClass('swatches_loaded');
        $(target).closest('.shopify-section').removeClass('swatches_loading');

    }
}
function showOptions(target) {  
    const product_handle = target.find('[data-product]').attr('data-product');
    const container = target.closest('.gallery-cell');

    if(container.find(`.custom_fs_options_wrapper[data-product='${product_handle}']`).length >0){
        return;
    }
    if(product_handle){
        console.log(container.find(`#${product_handle}`));
      if(container.find(`#${product_handle}`).length === 0){
        return;
      }
        const data =JSON.parse(container.find(`#${product_handle}`).text().trim());
        if(data.options.length === 1){
            const option_name = data.options[0];
            let options_html = `
            <div data-product=${data.handle} class="options-wrapper custom_fs_options_wrapper fs-result-page-u1f8u8" data-id-name="${option_name}" style="">
                <header class="fs-result-page-u1f8u8" style="display:none;">Select a Size</header>
                <div class="options fs-result-page-u1f8u8">
            `;

            for (let index = 0; index < data.variants.length; index++) {
                const element = data.variants[index];
                let available = 'available';
                if (!element.available) {
                    available = 'unavailable';
                };
                options_html +=  `
                <span data-id=${element.id} class="option fs-result-page-u1f8u8 ${available}">${element['option1']} </span>
                `
            }
            options_html += "</div></div>";


            if(container.find('.custom_fs_options_wrapper').length>0){
                console.log('hello');
                container.find('.custom_fs_options_wrapper').remove();
                $(options_html).appendTo(container.find('.product-image__wrapper'));
            }else{
                $(options_html).appendTo(container.find('.product-image__wrapper')).css('bottom','-50px').animate({
                    opacity: '1',
                    bottom:"0"
                },300);
            }

        }

    }
};
function removeOptions(container){
    container.animate({
        opacity: '0',
        bottom:"-20px"
    },300);
    setTimeout(() => {
        container.remove()
    }, 400);
}

function updateProductGrid(target) {
    const data = JSON.parse(target.find('script').text());
    if(data){
        buildProductGrid(target,data);
    }
}
function buildProductGrid(target,data) {  
    let container = target.closest('.gallery-cell').find('.product-wrap');
    if(container.length>0){
        const new_image = `
        <a href='/products/${data.handle}'>
        <div class="image-element__wrap">
        <img src='${data.featured_image}'  width="341" height="512">
        </div>
        </a>
        `;
        container.find('.product__imageContainer').attr('data-product',data.handle)
        container.find('.product__imageContainer').html(new_image);
        container.find('.product-thumbnail a').attr('href',`/products/${data.handle}`);
        container.find('.product-thumbnail a').text(data.title);

        let price_html = `<span class="money"> <span class="money">$${data.price/100} USD</span></span>
        `;
        if(data.compare_at_price){
            price_html += `
            <span class="product-thumbnail__was-price compare-at-price"> <span class="money"> <span class="money">$${data.compare_at_price/100} USD</span></span></span>
            `
        }
        container.find('.product-thumbnail__price').html(price_html);
    }

    container = target.closest('.quick-shop__popup');
    if(container.length>0){
        const new_image = `
        <img src='${data.featured_image}' width="341" height="512">
        `;
        container.find('a').each(function () {  
            $(this).attr('href',`/products/${data.handle}`);
        })

        container.find('a.quick-view-dialog-image').html(new_image);
        container.find('.quick-view-dialog-title').text(data.title);


        // Update thumbnails

        const images = data.images;
        let image_html = '';
        for (let index = 0; index < images.length; index++) {
          let new_image = images[index];
          new_image = new_image.split('.jpg')[0] + '_400x.jpg' + new_image.split('.jpg')[1];
          image_html += `<img loading="lazy" class="fs-single-image" src='${new_image}'>`;
        }
        container.find('.fs-images-bar-container').html(image_html);

        let price_html = `<span class="money"> <span class="money">$${data.price/100} USD</span></span>
        `;
        if(data.compare_at_price){
            price_html += `
            <span class="product-thumbnail__was-price compare-at-price"> <span class="money"> <span class="money">$${data.compare_at_price/100} USD</span></span></span>
            `
        }
        container.find('.quick-view-price-wrapper').html(price_html);

        // Update Form
        console.log(data);

        container.find('.variant-selection__variants option').each(function (index) {  
            if(index !== 0){
                $(this).val(data.variants[index-1].id);
                if(!data.variants[index-1].available){
                    var input_value = data.variants[index-1]['option1'];
                    container.find(`input[value='${input_value}']`).attr('data-variant-option-available',false);
                }else{
                    var input_value = data.variants[index-1]['option1'];
                    container.find(`input[value='${input_value}']`).attr('data-variant-option-available',true);
                }
            }
        })
    }
}
$(window).on('load',function() {
//   $('.footer__heading').click(function() {
//     $(this).next().$('ul').slideToggle('slow');
//   });
  // $('.custom_product_slider').flickity('destroy');
});

