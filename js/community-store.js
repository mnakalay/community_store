var communityStore = {

    openModal: function (content) {
        if ($(".store-whiteout").length) {
            $(".store-whiteout").empty().html(content);
        } else {
            $("body").append("<div class='store-whiteout'>" + content + "</div>");

            $(".store-whiteout").click(function (e) {
                if (e.target != this) return;  // only allow the actual whiteout background to close the dialog
                communityStore.exitModal();
            });

            $(document).keyup("keyup.communitywhiteout", function (e) {
                if (e.keyCode === 27) {
                    communityStore.exitModal();
                    $(document).unbind("keyup.communitywhiteout");
                }
            });
        }
    }
    ,
    waiting: function () {
        communityStore.openModal("<div class='store-spinner-container'><div class='store-spinner'></div></div>");
    },

    exitModal: function () {
        $(".store-whiteout").remove();
    },


//PRODUCT LIST

    //Open Product Modal
    productModal: function (pID) {
        communityStore.waiting();
        $.ajax({
            url: PRODUCTMODAL,
            data: {pID: pID},
            type: 'post',
            success: function (modalContent) {
                communityStore.openModal(modalContent);
            }
        });
    },

//SHOPPING CART

    displayCart: function (res) {
        $.ajax({
            type: "POST",
            data: res,
            url: CARTURL + '/getmodal',
            success: function (data) {
                communityStore.openModal(data);
            }
        });
    },


    //Add Item to Cart
    addToCart: function (pID, type) {
        var form;
        if (type == 'modal') {
            form = $('#store-form-add-to-cart-modal-' + pID);
        } else if (type == 'list') {
            form = $('#store-form-add-to-cart-list-' + pID);
        } else {
            form = $('#store-form-add-to-cart-' + pID);
        }
        var qty = $(form).find('.store-product-qty').val();
        if (qty > 0) {
            var serial = $(form).serialize();
            communityStore.waiting();
            $.ajax({
                url: CARTURL + "/add",
                data: serial,
                type: 'post',
                success: function (data) {
                    var res = jQuery.parseJSON(data);

                    if (res.product.pAutoCheckout == '1') {
                        window.location.href = CHECKOUTURL;
                        return false;
                    }

                    communityStore.displayCart(res);

                    $.ajax({
                        url: CARTURL + '/getTotalItems',
                        success: function (itemCount) {
                            $(".community-store-utility-links .items-counter").text(itemCount);
                            if (itemCount > 0) {
                                $(".store-utility-links").removeClass('store-cart-empty');
                            }
                        }
                    });
                    $.ajax({
                        url: CARTURL + '/getTotal',
                        success: function (subTotal) {
                            $(".community-store-utility-links .total-cart-amount").text(subTotal);
                        }
                    });
                }
            });
        } else {
            alert(QTYMESSAGE);
        }
    },

    //Update Item in Cart
    updateItem: function (instanceID, modal) {
        var qty = $("*[data-instance-id='" + instanceID + "']").find(".cart-list-product-qty input").val();
        communityStore.waiting();
        $.ajax({
            url: CARTURL + "/update",
            data: {instance: instanceID, pQty: qty},
            type: 'post',
            success: function (data) {
                if (modal) {
                    var res = jQuery.parseJSON(data);
                    communityStore.displayCart(res);
                }

                $.ajax({
                    url: CARTURL + '/getTotalItems',
                    success: function (itemCount) {
                        $(".community-store-utility-links .items-counter").text(itemCount);

                        if (itemCount == 0) {
                            $(".store-utility-links .store-items-counter").text(0);
                            $(".store-utility-links .store-total-cart-amount").text("");
                            $(".store-utility-links").addClass('store-cart-empty');
                        } else {
                            $.ajax({
                                url: CARTURL + "/getTotal",
                                success: function (total) {
                                    $(".cart-grand-total-value").text(total);
                                }
                            });

                            $.ajax({
                                url: CARTURL + '/getTotal',
                                success: function (subTotal) {
                                    $(".community-store-utility-links .total-cart-amount").text(subTotal);
                                }
                            });
                        }
                    }
                });

            }
        });
    },


    //Update Item in Cart
    updateMultiple: function (instances, quantities, modal) {
        communityStore.waiting();
        $.ajax({
            url: CARTURL + "/update",
            data: {instance: instances, pQty: quantities},
            type: 'post',
            success: function (data) {
                if (modal) {
                    var res = jQuery.parseJSON(data);
                    communityStore.displayCart(res);
                }

                $.ajax({
                    url: CARTURL + '/getTotalItems',
                    success: function (itemCount) {
                        $(".store-utility-links .items-counter").text(itemCount);

                        if (itemCount == 0) {
                            $(".store-utility-links .store-items-counter").text(0);
                            $(".store-utility-links .store-total-cart-amount").text("");
                            $(".store-utility-links").addClass('store-cart-empty');
                        } else {
                            $.ajax({
                                url: CARTURL + "/getTotal",
                                success: function (total) {
                                    $(".store-cart-grand-total-value").text(total);
                                }
                            });

                            $.ajax({
                                url: CARTURL + '/getTotal',
                                success: function (subTotal) {
                                    $(".community-store-utility-links .total-cart-amount").text(subTotal);
                                }
                            });
                        }
                    }
                });

            }
        });
    },

    //Remove Item in Cart
    removeItem: function (instanceID, modal) {
        communityStore.waiting();
        $.ajax({
            url: CARTURL + "/remove",
            data: {instance: instanceID},
            type: 'post',
            success: function (data) {
                if (modal) {
                    var res = jQuery.parseJSON(data);
                    communityStore.displayCart(res);
                }

                $.ajax({
                    url: CARTURL + '/getTotalItems',
                    success: function (itemCount) {
                        $(".community-store-utility-links .items-counter").text(itemCount);

                        if (itemCount == 0) {
                            $(".store-utility-links .store-items-counter").text(0);
                            $(".store-utility-links .store-total-cart-amount").text("");
                            $(".store-utility-links").addClass('store-cart-empty');
                        } else {
                            $.ajax({
                                url: CARTURL + "/getTotal",
                                success: function (total) {
                                    $(".store-cart-grand-total-value").text(total);
                                }
                            });

                            $.ajax({
                                url: CARTURL + '/getTotal',
                                success: function (subTotal) {
                                    $(".community-store-utility-links .total-cart-amount").text(subTotal);
                                }
                            });
                        }
                    }
                });
            }
        });
    },

    //Clear the Cart
    clearCart: function (modal) {
        $.ajax({
            url: CARTURL + "/clear",
            success: function (data) {
                if (modal) {
                    var res = jQuery.parseJSON(data);
                    communityStore.displayCart(res);
                }

                $.ajax({
                    url: CARTURL + "/getTotal",
                    success: function (total) {
                        $(".store-cart-grand-total-value").text(total);
                        $(".store-cart-page-cart-list-item").remove();
                        $(".store-utility-links .store-items-counter").text(0);
                        $(".store-utility-links .store-total-cart-amount").text("");
                        $(".store-utility-links").addClass('store-cart-empty');
                    }
                });

            }
        });
    },

//CHECKOUT

    loadViaHash: function () {
        var hash = window.location.hash;
        hash = hash.replace('#', '');
        if (hash != "") {
            //$(".checkout-form-group .checkout-form-group-body").hide();
            $(".store-active-form-group").removeClass('store-active-form-group');
            var pane = $("#store-checkout-form-group-" + hash);
            pane.addClass('store-active-form-group');

            $('html, body').animate({
                scrollTop: pane.offset().top
            });
        }
    },
    //loadViaHash();

    updateBillingStates: function (load) {
        var countryCode = $("#store-checkout-billing-country").val();
        var selectedState;
        if (load) {
            selectedState = $("#store-checkout-saved-billing-state").val();
        } else {
            selectedState = '';
        }

        $.ajax({
            url: CHECKOUTURL + "/getstates",
            type: 'post',
            data: {country: countryCode, selectedState: selectedState, type: "billing"},
            success: function (states) {
                $("#store-checkout-billing-state").replaceWith(states);
            }
        });
    },


    updateShippingStates: function (load) {
        var countryCode = $("#store-checkout-shipping-country").val();
        var selectedState;
        if (load) {
            selectedState = $("#store-checkout-saved-shipping-state").val();
        } else {
            selectedState = '';
        }

        $.ajax({
            url: CHECKOUTURL + "/getstates",
            type: 'post',
            data: {country: countryCode, selectedState: selectedState, type: "shipping"},
            success: function (states) {
                $("#store-checkout-shipping-state").replaceWith(states);
            }
        });
    },


    nextPane: function (obj) {
        if ($(obj)[0].checkValidity()) {
            var pane = $(obj).closest(".store-checkout-form-group").find('.store-checkout-form-group-body').parent().next();
            $('.store-active-form-group').removeClass('store-active-form-group');
            pane.addClass('store-active-form-group');
            $(obj).closest(".store-checkout-form-group").addClass('store-checkout-form-group-complete');

            $('html, body').animate({
                scrollTop: pane.offset().top
            });

            pane.find('input:first-child').focus();
        }
    },

    showShippingMethods: function () {
        $.ajax({
            url: CHECKOUTURL + "/getShippingMethods",
            success: function (html) {
                $("#store-checkout-shipping-method-options").html(html);
            }
        });
    },

    showPaymentForm: function () {
        var pmID = $("#store-checkout-payment-method-options input[type='radio']:checked").attr('data-payment-method-id');
        $('.store-payment-method-container').addClass('hidden');
        $(".store-payment-method-container[data-payment-method-id='" + pmID + "']").removeClass('hidden');
    }


};

communityStore.updateBillingStates(true);
communityStore.updateShippingStates(true);
communityStore.showShippingMethods();
communityStore.showPaymentForm();

$(document).ready(function () {
    $("#store-checkout-form-group-billing").submit(function (e) {
        e.preventDefault();
        var email = $("#store-email").val();
        var bfName = $("#store-checkout-billing-first-name").val();
        var blName = $("#store-checkout-billing-last-name").val();
        var bPhone = $("#store-checkout-billing-phone").val();
        var bAddress1 = $("#store-checkout-billing-address-1").val();
        var bAddress2 = $("#store-checkout-billing-address-2").val();
        var bCountry = $("#store-checkout-billing-country").val();
        var bCity = $("#store-checkout-billing-city").val();
        var bState = $("#store-checkout-billing-state").val();
        var bPostal = $("#store-checkout-billing-zip").val();
        $("#store-checkout-form-group-billing .store-checkout-form-group-body .store-checkout-errors").remove();

        communityStore.waiting();
        var obj = $(this);
        $.ajax({
            url: CHECKOUTURL + "/updater",
            type: 'post',
            data: {
                adrType: 'billing',
                email: email,
                fName: bfName,
                lName: blName,
                phone: bPhone,
                addr1: bAddress1,
                addr2: bAddress2,
                count: bCountry,
                city: bCity,
                state: bState,
                postal: bPostal
            },
            //dataType: 'json',
            success: function (result) {
                //var test = null;
                var response = JSON.parse(result);
                if (response.error == false) {
                    $(".store-whiteout").remove();
                    obj.find('.store-checkout-form-group-summary .store-summary-name').html(response.first_name + ' ' + response.last_name);
                    obj.find('.store-checkout-form-group-summary .store-summary-phone').html(response.phone);
                    obj.find('.store-checkout-form-group-summary .store-summary-email').html(response.email);
                    obj.find('.store-checkout-form-group-summary .store-summary-address').html(response.address);
                    communityStore.nextPane(obj);
                    //update tax
                    $.ajax({
                        url: CARTURL + "/getTaxTotal",
                        success: function (results) {
                            var taxes = JSON.parse(results);
                            //alert(taxes.length);
                            $("#store-taxes").html("");
                            for (var i = 0; i < taxes.length; i++) {
                                if (taxes[i].taxed === true) {
                                    $("#store-taxes").append('<li class="store-line-item store-tax-item"><strong>' + taxes[i].name + ":</strong> <span class=\"store-tax-amount\">" + taxes[i].taxamount + "</span><li>");
                                }
                            }
                        }
                    });
                    $.ajax({
                        url: CARTURL + "/getTotal",
                        success: function (total) {
                            $(".store-total-amount").text(total);
                        }
                    });
                } else {
                    $("#store-checkout-form-group-billing .store-checkout-form-group-body").prepend('<div class="community-store-col-1 checkout-errors"><div class="alert alert-danger"></div></div>');
                    $("#store-checkout-form-group-billing .alert").html(response.errors.join('<br>'));
                    $('.store-whiteout').remove();
                }
            },
            error: function (data) {
                $(".store-whiteout").remove();
            }
        });

    });
    $("#store-checkout-form-group-shipping").submit(function (e) {
        e.preventDefault();
        var sfName = $("#checkout-shipping-first-name").val();
        var slName = $("#checkout-shipping-last-name").val();
        var sAddress1 = $("#checkout-shipping-address-1").val();
        var sAddress2 = $("#checkout-shipping-address-2").val();
        var sCountry = $("#checkout-shipping-country").val();
        var sCity = $("#checkout-shipping-city").val();
        var sState = $("#checkout-shipping-state").val();
        var sPostal = $("#checkout-shipping-zip").val();
        $("#store-checkout-form-group-shipping .store-checkout-form-group-body .store-checkout-errors").remove();

        communityStore.waiting();
        var obj = $(this);
        $.ajax({
            url: CHECKOUTURL + "/updater",
            type: 'post',
            data: {
                adrType: 'shipping',
                fName: sfName,
                lName: slName,
                addr1: sAddress1,
                addr2: sAddress2,
                count: sCountry,
                city: sCity,
                state: sState,
                postal: sPostal
            },
            //dataType: 'json',
            success: function (result) {
                var response = JSON.parse(result);
                if (response.error == false) {
                    $(".store-whiteout").remove();
                    obj.find('.store-checkout-form-group-summary .store-summary-name').html(response.first_name + ' ' + response.last_name);
                    obj.find('.store-checkout-form-group-summary .store-summary-address').html(response.address);
                    communityStore.nextPane(obj);
                    //update tax
                    $.ajax({
                        url: CARTURL + "/getTaxTotal",
                        success: function (results) {
                            var taxes = JSON.parse(results);
                            $("#taxes").html("");
                            for (var i = 0; i < taxes.length; i++) {
                                if (taxes[i].taxed === true) {
                                    $("#store-taxes").append('<li class="store-line-item store-tax-item"><strong>' + taxes[i].name + ":</strong> <span class=\"tax-amount\">" + taxes[i].taxamount + "</span></li>");
                                }
                            }
                        }
                    });
                    communityStore.showShippingMethods();
                    $.ajax({
                        url: CARTURL + "/getTotal",
                        success: function (total) {
                            $(".store-total-amount").text(total);
                        }
                    });
                } else {
                    $("#store-checkout-form-group-shipping .store-checkout-form-group-body").prepend('<div class="store-checkout-errors"><div class="alert alert-danger"></div></div>');
                    $("#store-checkout-form-group-shipping .alert").html(response.errors.join('<br>'));
                    $('.store-whiteout').remove();
                }
            },
            error: function (data) {
                $(".store-whiteout").remove();
            }
        });

    });
    $("#store-checkout-form-group-shipping-method").submit(function (e) {
        e.preventDefault();
        communityStore.waiting();
        var obj = $(this);
        if ($("#store-checkout-shipping-method-options input[type='radio']:checked").length < 1) {
            $('.store-whiteout').remove();
            alert("Please select a shipping method");
        } else {
            var smID = $("#store-checkout-shipping-method-options input[type='radio']:checked").val();
            var methodText = $.trim($("#store-checkout-shipping-method-options input[type='radio']:checked").parent().text());
            obj.find('.store-summary-shipping-method').html(methodText);

            $.ajax({
                type: 'post',
                data: {smID: smID},
                url: CARTURL + "/getShippingTotal",
                success: function (total) {
                    $("#shipping-total").text(total);
                    $.ajax({
                        url: CARTURL + "/getTaxTotal",
                        success: function (results) {
                            var taxes = JSON.parse(results);
                            $("#taxes").html("");
                            for (var i = 0; i < taxes.length; i++) {
                                if (taxes[i].taxed === true) {
                                    $("#taxes").append('<li class="store-line-item store-tax-item"><strong>' + taxes[i].name + ":</strong> <span class=\"store-tax-amount\">" + taxes[i].taxamount + "</span></li>");
                                }
                            }
                        }
                    });
                    $.ajax({
                        url: CARTURL + "/getTotal",
                        success: function (total) {
                            $(".store-total-amount").text(total);
                            communityStore.nextPane(obj);
                            $('.store-whiteout').remove();
                        }
                    });
                }
            });

        }
    });
    $(".store-btn-previous-pane").click(function (e) {
        //hide the body of the current pane, go to the next pane, show that body.
        var pane = $(this).closest(".store-checkout-form-group").find('.store-checkout-form-group-body').parent().prev();
        $('.store-active-form-group').removeClass('store-active-form-group');
        pane.addClass('store-active-form-group');

        $('html, body').animate({
            scrollTop: pane.parent().offset().top
        });

        $(this).closest(".store-checkout-form-group").prev().removeClass("store-checkout-form-group-complete");
        e.preventDefault();
    });
    $("#ckbx-copy-billing").change(function () {
        if ($(this).is(":checked")) {
            $("#checkout-shipping-first-name").val($("#checkout-billing-first-name").val());
            $("#checkout-shipping-last-name").val($("#checkout-billing-last-name").val());
            $("#checkout-shipping-email").val($("#checkout-billing-email").val());
            $("#checkout-shipping-phone").val($("#checkout-billing-phone").val());
            $("#checkout-shipping-address-1").val($("#checkout-billing-address-1").val());
            $("#checkout-shipping-address-2").val($("#checkout-billing-address-2").val());
            $("#checkout-shipping-country").val($("#checkout-billing-country").val());
            $("#checkout-shipping-city").val($("#checkout-billing-city").val());
            var billingstate = $("#checkout-billing-state").clone().val($("#checkout-billing-state").val()).attr("name", "checkout-shipping-state").attr("id", "checkout-shipping-state");
            $("#checkout-shipping-state").replaceWith(billingstate);
            $("#checkout-shipping-zip").val($("#checkout-billing-zip").val());
        }
    });
    $("#store-checkout-payment-method-options input[type='radio']").change(function () {
        communityStore.showPaymentForm();
    });

    $('#store-cart .store-btn-cart-list-remove').click(function(e){
        $('#deleteform input[name=instance]').val($(this).data('instance'));
        $('#deleteform').submit();
        e.preventDefault();
    });

    $(document).on('click', '.store-btn-add-to-cart', function(e) {
        communityStore.addToCart($(this).data('product-id'),$(this).data('add-type'))
        e.preventDefault();
    });


    $(document).on('click', '.store-btn-cart-list-remove', function(e) {
        communityStore.removeItem($(this).data('instance-id'),$(this).data('modal'))
        e.preventDefault();
    });

    $('.store-product-quick-view').click(function(e){
        communityStore.productModal($(this).data('product-id'));
        e.preventDefault();
    });

    $('.store-cart-link-modal').click(function(e){
        communityStore.displayCart();
        e.preventDefault();
    });

    $(document).on('click', '.store-modal-exit, .store-btn-cart-modal-continue', function(e) {
        communityStore.exitModal();
        e.preventDefault();
    });

    $(document).on('click', '.store-btn-cart-modal-clear', function(e) {
        communityStore.clearCart(true)
        e.preventDefault();
    });

    $(document).on('click', '.store-btn-cart-modal-update', function(e) {
       var instances = $("#store-modal-cart input[name='instance[]']").map(function(){return $(this).val();}).get();
       var pQty = $("#store-modal-cart input[name='pQty[]']").map(function(){return $(this).val();}).get();

        communityStore.updateMultiple(instances,pQty,true);
        e.preventDefault();
    });

    $(document).on('click', '.store-btn-cart-list-update', function(e) {
        communityStore.waiting();
    });


    $('.store-cart-modal-link').click(function (e) {
        e.preventDefault();
        communityStore.displayCart();
    });

});