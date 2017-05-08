$(document).on("pagecreate", function() {
    $(document).on("pagecontainershow", function(){
        $(".ui-content").height(getRealContentHeight());
    })

    $(window).on("resize orientationchange", function(){
        $(".ui-content").height(getRealContentHeight());
    })

    function getRealContentHeight() {
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
        screen = $.mobile.getScreenHeight(),
        header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight() - 1 : $(".ui-header").outerHeight(),
        footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight(),
        contentMargins = $(".ui-content", activePage).outerHeight() - $(".ui-content", activePage).height();
        var contentHeight = screen - header - footer - contentMargins;    

        return contentHeight;
    }
});