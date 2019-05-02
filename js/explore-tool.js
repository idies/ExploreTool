/*! SQLSearchWP-Casjobs - v1.0.0 - by:1.0.0 - license: - 2019-05-02 */+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);
;+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.7'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
;+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.7'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);
;/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);
;+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);
;+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
;+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);
;+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);
;(function($) {
	'use strict';

	// PUBLIC CLASS DEFINITION
	// ================================

	var EXDEBUG = true;

	var explore = {

		context: "ex-container",
		
		attributes: {
			objID: "1237662301903192106",
			ra: "229.525575753922",
			dec: "42.7458537608544"
		},
		
		specData: {},
		
		queriesFinished: {
			data: true,
			imaging: true,
			USNO: true,
			FIRST: true,
			ROSAT: true,
			RC3: true,
			TwoMASS: true,
			WISE: true,
			spectra: true,
			manga: true,
			apogee: true,
			visits: true
		},
		
		targets: {
		data:{
			//put back in https:
		    url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
		    ContentType:"application/json",
		    type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
		    success: function (data) {
				if(data === "\n") {
					$("ex-data").html(data);
					explore.queriesFinished.data = true;
					explore.queriesFinished.imaging = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayData( dict , true);
					explore.toBin(dict);
				}
		    }
		},
		USNO:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					data = "There is no USNO data available for this object";
					$("#ex-cross-USNO").html(data);
					explore.queriesFinished.USNO = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayUSNO( dict , true);
				}
		    }
		},
		FIRST:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					data = "There is no FIRST data available for this object";
					$("#ex-cross-FIRST").html(data);
					explore.queriesFinished.FIRST = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayFIRST( dict , true);
				}
		    }
		},
		ROSAT:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					data = "There is no ROSAT data available for this object";
					$("#ex-cross-ROSAT").html(data);
					explore.queriesFinished.ROSAT = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayROSAT( dict , true);
				}
		    }
		},
		RC3:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					data = "There is no RC3 data available for this object";
					$("#ex-cross-RC3").html(data);
					explore.queriesFinished.RC3 = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayRC3( dict , true);
				}
		    }
		},
		TwoMASS:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					data = "There is no TwoMASS data available for this object";
					$("#ex-cross-TwoMASS").html(data);
					explore.queriesFinished.TwoMASS = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayTwoMASS( dict , true);
				}
		    }
		},
		WISE:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					data = "There is no WISE data available for this object";
					$("#ex-cross-WISE").html(data);
					explore.queriesFinished.WISE = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayWISE( dict , true);
				}
		    }
		},
		spectra:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					data = "There is no Optical Spectra data available for this object";
					$("#ex-spectra").html(data);
					explore.queriesFinished.spectra = true;
					explore.updateHour();
				} else {
					explore.specData = explore.convertDict(data);
					var target = explore.targets.spectraCount;
					target.data.Query = "select count(SpecObjID) as count from SpecObjAll where bestObjID="+explore.specData.bestObjID;
					$.ajax(target);
				}
		    }
		},
		spectraCount:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					data = "There is no Optical Spectra data available for this object";
					$("#ex-spectra").html(data);
					explore.queriesFinished.spectra = true;
					explore.updateHour();
				} else {
					explore.displaySpectra( explore.specData , explore.convertDict(data), true);
				}
		    }
		},
		manga:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					data = "There is no MaNGA data available for this object";
					$("#ex-manga").html(data);
					explore.queriesFinished.manga = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayManga( dict , true);
				}
		    }
		},
		apogee:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					data = "There is no Apogee data available for this object";
					$("#ex-apogee").html(data);
					explore.queriesFinished.apogee = true;
					explore.updateHour();
				} else {
					var dict = explore.convertDict(data);
					explore.displayApogee( dict , true);
				}
		    }
		},
		visits:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					data = "There is no Visits data available for this object";
					$("#ex-visits").html(data);
					explore.queriesFinished.visits = true;
					explore.updateHour();
				} else {
					explore.displayVisits( data , true);
				}
		    }
		},
		radecFromObj:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					explore.attributes.ra = "";
					explore.attributes.dec = "";
				} else {
					var dict = explore.convertDict(data);
					explore.attributes.ra = dict.ra;
					explore.attributes.dec = dict.dec;
				}
				explore.doSearch();
		    }
		},
		objFromRaDec:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					explore.attributes.objID = "";
				} else {
					var dict = explore.convertDict(data);
					explore.attributes.objID = dict.objID;
				}
				explore.doSearch();
		    }
		},
		objFromOther:{
			url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr15/query",
			ContentType:"application/json",
			type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
			success: function (data) {
				if(data === "\n") {
					explore.attributes.objID = "";
				} else {
					var dict = explore.convertDict(data);
					explore.attributes.objID = dict.objID;
				}
				var target = explore.targets.radecFromObj;
				target.data.Query = "select ra,dec from PhotoObjAll where objID=" + explore.attributes.objID;
				$.ajax(target);
		    }
		},
		radecFromName:{
			url:"",
			type: "GET",
			success: function (data) {
				if(data === "\n") {
					explore.attributes.ra = "";
					explore.attributes.dec = "";
				} else {
					explore.attributes.ra = data.data[0][0].toString();
					explore.attributes.dec = data.data[0][1].toString();
				}
				var target = explore.targets.objFromRaDec;
				target.data.Query = "select top 1 dbo.fGetNearestObjIdAllEq("+explore.attributes.ra+","+explore.attributes.dec+",0.5) as objID";
				$.ajax(target);
		    }
		}
		},
			
		init: function(){
			explore.attributes.objID = $("#default-value").attr('data-value');
			var target = explore.targets.radecFromObj;
			target.data.Query = "select ra,dec from PhotoObjAll where objID=" + explore.attributes.objID;
			$.ajax(target);
			this.showForm( explore.context , false , true );
			$(document).on('click', "#Name_button", explore.nameSearch);
			$(document).on('click', "#SpecObjID_button", explore.specObjSearch);
			$(document).on('click', "#Ra_Dec_button", explore.ra_decSearch);
			$(document).on('click', "#SDSS_button", explore.sdssSearch);
			$(document).on("click", "#ObjID_button", explore.objSearch);
			$(document).on('click', "#plate_mjd_fiber_button", explore.plateSearch);
			$(document).on('click', "#mangaID_button", explore.mangaSearch);
		},
		
		nameSearch: function(e) {
			explore.resetData();
			var value = $("#Name").attr('value');
			var target = explore.targets.radecFromName;
			target.url = "//simbad.u-strasbg.fr/simbad/sim-tap/sync?request=doQuery&lang=adql&format=json&query=SELECT%20a.ra,a.dec%20from%20basic%20as%20a,IDENT%20as%20b%20where%20a.oid=b.oidref%20and%20b.id=%27" + value + "%27";
			$.ajax(target);
		},
		
		specObjSearch: function(e) {
			explore.resetData();
			var value = $("#SpecObjID").attr('value');
			var target;
			if(value.includes(".")) {
				target = explore.targets.objFromOther;
				target.data.Query = "select top 1 ra,dec,dbo.fGetNearestObjIdAllEq(ra,dec,0.5) as objID from apogeeStar where apstar_id='" + value + "'";
				$.ajax(target);
			} else if(value.includes("+")) {
				target = explore.targets.objFromOther;
				target.data.Query = "select top 1 ra,dec,dbo.fGetNearestObjIdAllEq(ra,dec,0.5) as objID from apogeeStar where apogee_id='" + value + "'";
				$.ajax(target);
				
			} else {
				target = explore.targets.objFromOther;
				target.data.Query = "select bestObjID as objID from SpecObjAll where specObjID=" + value;
				$.ajax(target);
			}
		},
		
		ra_decSearch: function(e) {
			explore.resetData();
			explore.attributes.ra = $("#Ra").attr('value');
			explore.attributes.dec = $("#Dec").attr('value');
			var target = explore.targets.objFromRaDec;
			target.data.Query = "select top 1 dbo.fGetNearestObjIdAllEq("+explore.attributes.ra+","+explore.attributes.dec+",0.5) as objID";
			$.ajax(target);
		},
		
		sdssSearch: function(e) {
			explore.resetData();
			var values = ($("#SDSS").attr('value')).split("-");
			var target = explore.targets.objFromOther;
			target.data.Query = "select top 1 objID from PhotoObjAll where run="+values[0]+" and rerun="+values[1]+" and camcol="+values[2]+" and field="+values[3]+" and obj="+values[4];
			$.ajax(target);
		},
		
		objSearch: function(e) {
			explore.resetData();
			explore.attributes.objID = $("#ObjID").attr('value');
			var target = explore.targets.radecFromObj;
			target.data.Query = "select ra,dec from PhotoObjAll where objID=" + explore.attributes.objID;
			$.ajax(target);
			
		},
		
		plateSearch: function(e) {
			explore.resetData();
			var plate_val = $("#Plate").attr('value');
			var mjd_val = $("#MJD").attr('value');
			var fiber_val = $("#Fiber").attr('value');
			var target = explore.targets.objFromOther;
			target.data.Query = "select a.objID from photoObjAll a,SpecObjAll b where a.objID=b.bestObjID and b.plate="+plate_val+" and b.mjd="+mjd_val+" and b.fiberID="+fiber_val;
			$.ajax(target);
		},
		
		mangaSearch: function(e) {
			explore.resetData();
			var manga = $("#MangaID").attr('value');
			var target = explore.targets.objFromOther;
			target.data.Query = "select top 1 objra,objdec,dbo.fGetNearestObjIdAllEq(objra,objdec,0.5) as objID from mangaDAPall where mangaid='" + manga + "'";
			$.ajax(target);
		},
		
		doSearch: function() {
			explore.queriesFinished.data = false;
			explore.queriesFinished.imaging = false;
			explore.queriesFinished.USNO = false;
			explore.queriesFinished.FIRST = false;
			explore.queriesFinished.ROSAT = false;
			explore.queriesFinished.RC3 = false;
			explore.queriesFinished.TwoMASS = false;
			explore.queriesFinished.WISE = false;
			explore.queriesFinished.spectra = false;
			explore.queriesFinished.manga = false;
			explore.queriesFinished.apogee = false;
			explore.queriesFinished.visits = false;
			$("#ex-hour").prop("style", "");
			var target = explore.targets.data;
			target.data.Query = "SELECT dbo.fPhotoTypeN(p.type) AS Type, p.ra, p.dec, p.run, p.rerun, p.camcol, p.field, p.obj, p.specObjID, p.objID, p.l, p.b, p.type, p.u, p.g, p.r, p.i, p.z AS pz, p.err_u, p.err_g, p.err_r, p.err_i, p.err_z, p.flags, p.mjd AS ImageMJD, dbo.fMjdToGMT(p.mjd) AS ImageMJDString, dbo.fPhotoModeN(p.mode) AS Mode, p.parentID, p.nChild, p.extinction_r, p.petroRad_r, p.petroRadErr_r, Photoz.z AS Photoz, Photoz.zerr AS Photoz_err, zooSpec.spiral AS Zoo1Morphology_spiral, zooSpec.elliptical AS Zoo1Morphology_elliptical, zooSpec.uncertain AS Zoo1Morphology_uncertain, s.instrument, s.class, s.z, s.zErr, s.survey, s.programname, s.sourcetype, s.velDisp, s.velDispErr, s.plate, s.mjd AS specMJD, s.fiberID FROM PhotoObjAll AS p LEFT JOIN Photoz ON Photoz.objID = p.objID LEFT JOIN zooSpec ON zooSpec.objID = p.objID LEFT JOIN SpecObjAll AS s ON s.specObjID = p.specObjID WHERE p.objID=" + explore.attributes.objID;
			$.ajax(target);
			
			target = explore.targets.USNO;
			target.data.Query = "select PROPERMOTION, MURAERR, MUDECERR, ANGLE from USNO where OBJID=" + explore.attributes.objID;
			$.ajax(target);
			
			target = explore.targets.FIRST;
			target.data.Query = "select f.peak,f.rms,f.major,f.minor from FIRST f where f.objID=" + explore.attributes.objID;
			$.ajax(target);
			
			target = explore.targets.ROSAT;
			target.data.Query = "select q.CPS, q.HR1,q.HR2,q.EXT from ROSAT q where q.OBJID=" + explore.attributes.objID;
			$.ajax(target);
			
			target = explore.targets.RC3;
			target.data.Query = "select r.HUBBLE, r.M21, r.M21ERR, r.HI from RC3 r where r.objID=" + explore.attributes.objID;
			$.ajax(target);
			
			target = explore.targets.TwoMASS;
			target.data.Query = "select j,h,k, phQual from TwoMASS s where s.OBJID=" + explore.attributes.objID;
			$.ajax(target);
			
			target = explore.targets.WISE;
			target.data.Query = "select TwoMASS.OBJID, t.w1mag, t.w2mag, t.w3mag, t.w4mag from WISE_allsky t, TwoMASS where t.tmass_key=TwoMASS.ptsKey and TwoMASS.OBJID=" + explore.attributes.objID;
			$.ajax(target);
			
			target = explore.targets.spectra;
			//Still need to find function for legacy_target2
			target.data.Query = "select top 1 a.bestObjID,a.specObjID, a.img, a.fiberID, a.mjd, a.plate, a.survey, a.programname, a.instrument,a.sourceType,a.z, a.zErr, dbo.fSpecZWarningN(a.zWarning) as WARNING, a.sciencePrimary, dbo.fPrimTargetN(a.legacy_target1) as targetOne, a.legacy_target2 as targetTwo, a.class as CLASS, a.velDisp, a.velDispErr from SpecObjAll a where bestObjID=" + explore.attributes.objID+" order by a.sciencePrimary DESC";
			$.ajax(target);
			
			target = explore.targets.manga;
			target.data.Query = "select * from dbo.fGetNearestMangaObjEq(" + explore.attributes.ra + "," + explore.attributes.dec + ",0.5)";
			$.ajax(target);
			
			target = explore.targets.apogee;
			target.data.Query = "select b.apogee_id, dbo.fApogeeStarFlagN(m.starflag) as starflag,dbo.fApogeeAspcapFlagN(a.aspcapflag) as ascapflag,a.teff,a.teff_err,a.logg,a.logg_err,a.fe_h,a.fe_h_err,a.alpha_m,a.alpha_m_err,m.vhelio_avg,m.vscatter,dbo.fApogeeTarget1N(m.apogee_target1) as target1,dbo.fApogeeTarget2N(m.apogee_target2) as target2,m.commiss,p.ra,p.dec,m.glon,m.glat,p.apogee_id,m.apstar_id,p.j,p.j_err,p.h,p.h_err,p.k,p.k_err, p.irac_4_5, p.irac_4_5_err, p.src_4_5 from apogeeObject p, apogeeStar m, aspcapStar a, dbo.fGetNearestApogeeStarEq(" + explore.attributes.ra + "," + explore.attributes.dec + ",0.5) b where p.apogee_id=b.apogee_id and a.apogee_id=b.apogee_id and m.apogee_id=b.apogee_id";
			$.ajax(target);
			
			target = explore.targets.visits;
			target.data.Query = "select a.visit_id, a.plate, a.mjd, a.fiberid, dbo.fMjdToGMT(a.mjd) as string, a.vrel, b.apogee_id from apogeeVisit a, dbo.fGetNearestApogeeStarEq(" + explore.attributes.ra + "," + explore.attributes.dec + ",0.5) b where a.apogee_id=b.apogee_id order by mjd";
			$.ajax(target);
		},
		
		
		doCollapse: function( toggle, container, show ) {
			$('.collapse').collapse();
			if ( show === true ) {
				$(container).collapse('show');
			} else {
				$(container).collapse('hide');
			}
		},
		
		showForm: function( context , append , show ) {
			var toggle = $('.ex-form-wrap>h2>a[data-toggle]', explore.context);
			var container = $(".ex-form-wrap", explore.context);
			if (EXDEBUG) { console.log(  $( toggle ).attr('href') ); }
			
			var contents = ( append !== undefined && append ) ? $(container).html() : '' ;
			
			explore.doCollapse(explore.context + ' .ex-form-wrap>h2>a[data-toggle]', container, show );
			
		},
		
		/**
		 * @summary Appends or updates the displayed Results.
		 * 
		 * @param String $results Results to display
		 * @param Boolean $append Append or replace current message(s)
		**/
		displayData: function( dict , show) {
			var container = $("#ex-data");
			var contents = explore.formatLineOne(dict);
			contents += ('<br>' + explore.formatLineTwo(dict));
			$(container).html(contents);
			explore.doCollapse(explore.context + ' .ex-data-wrap>h2>a[data-toggle]', $("#ex-data-outer"), show );
			explore.queriesFinished.data = true;
			explore.updateHour();
		},
		
		displayImaging: function( dict, binFlags, show) {
			var container = $("#ex-imaging");
			var contents = explore.formatImaging(dict, binFlags);
			$(container).html(contents);
			explore.doCollapse(explore.context + ' .ex-imaging-wrap>h2>a[data-toggle]', $("#ex-imaging-outer"), show );
			explore.queriesFinished.imaging = true;
			explore.updateHour();
		},
		
		displayUSNO: function(dict, show) {
			var container = $("#ex-cross-USNO");
			var contents = explore.formatUSNO(dict);
			$(container).html(contents);
			explore.queriesFinished.USNO = true;
			explore.updateHour();
		},
		
		displayFIRST: function(dict, show) {
			var container = $("#ex-cross-FIRST");
			var contents = explore.formatFIRST(dict);
			$(container).html(contents);
			explore.queriesFinished.FIRST = true;
			explore.updateHour();
		},
		
		displayROSAT: function(dict, show) {
			var container = $("#ex-cross-ROSAT");
			var contents = explore.formatROSAT(dict);
			$(container).html(contents);
			explore.queriesFinished.ROSAT = true;
			explore.updateHour();
		},
		
		displayRC3: function(dict, show) {
			var container = $("#ex-cross-RC3");
			var contents = explore.formatRC3(dict);
			$(container).html(contents);
			explore.queriesFinished.RC3 = true;
			explore.updateHour();
		},
		
		displayTwoMASS: function(dict, show) {
			var container = $("#ex-cross-TwoMASS");
			var contents = explore.formatTwoMASS(dict);
			$(container).html(contents);
			explore.queriesFinished.TwoMASS = true;
			explore.updateHour();
		},
		
		displayWISE: function(dict, show) {
			var container = $("#ex-cross-WISE");
			var contents = explore.formatWISE(dict);
			$(container).html(contents);
			explore.queriesFinished.WISE = true;
			explore.updateHour();
		},
		
		displaySpectra: function(dict, count, show) {
			var container = $("#ex-spectra");
			var contents = explore.formatSpectra(dict, count);
			$(container).html(contents);
			explore.queriesFinished.spectra = true;
			explore.updateHour();
		},
		
		displayManga: function(dict, show) {
			var container = $("#ex-manga");
			var contents = explore.formatManga(dict);
			$(container).html(contents);
			explore.queriesFinished.manga = true;
			explore.updateHour();
		},
		
		displayApogee: function(dict, show) {
			var container = $("#ex-apogee");
			var contents = explore.formatApogee(dict);
			$(container).html(contents);
			explore.queriesFinished.apogee = true;
			explore.updateHour();
		},
		
		displayVisits: function(input, show) {
			var container = $("#ex-visits");
			var contents = explore.formatVisits(input);
			$(container).html(contents);
			explore.queriesFinished.visits = true;
			explore.updateHour();
		},
		
		formatVisits: function(input) {
			var output = '<table class="table-bordered table-responsive"><tr><th>visit_id</th><th>plate</th><th>mjd</th><th>fiberid</th><th>date</th><th>time (UTC)</th><th>vrel</th></tr>';
			var body = input.substring(input.indexOf('"'));
			var lines = body.split('\n');
			for(var i = 0; i < lines.length - 1; i++) {
				output += '<tr>';
				var line = lines[i].split(',');
				for(var x = 0; x < line.length - 1; x++) {
					line[x] = line[x].replace('"', '');
					line[x] = line[x].replace('"', '');
					output += '<td>';
					if(x !== 4) {
						output += line[x];
					} else {
						var temp = line[x].split(' ');
						output += (temp[0] + '</td><td>');
						output += temp[1];
					}
					output += '</td>';
				}
				output += '</tr>';
			}
			output += '</table>';
			return output;
		},
		
		formatApogee: function(dict) {
			var output ='<strong>Targeted star apogee_id</strong>: ' + dict.apogee_id + '<br>';
			output += '<table class="table-bordered table-responsive"><tr><th>Instrument</th><td>APOGEE</td></tr>';
			output += ('<tr><th>apstar_id</th><td>'+dict.apstar_id+'</td></tr></table>');
			output += '<table class="table-bordered table-responsive"><tr>';
			output += '<th colspan="2">Galactic Coordinates</th><th colspan="2">RA,dec</th></tr>';
			output += '<tr><th>Longitude (L)</th><th>Latitude (B)</th><th>Decimal</th><th>Sexagesimal</th></tr>';
			output += '<tr><td>'+dict.glon+'</td><td>'+dict.glat+'</td><td>'+dict.ra+', '+dict.dec+'</td><td>'+explore.raToSexagesimal(parseFloat(dict.ra))+', '+explore.decToSexagesimal(parseFloat(dict.dec))+'</td></tr></table>';
			var apstar = (dict.apstar_id).split(".");
			var imLink = '"https://dr15.sdss.org/sas/dr15/'+apstar[0]+'/spectro/redux/r8/stars/'+apstar[1]+'/'+apstar[4]+'/plots/apStar-r8-'+apstar[5].replace("+","%2b")+'.jpg"';
			output += ('<img style="-webkit-user-select: none;" src='+imLink+'>');
			output += ('<table class="table-responsive"><tr><td><a href="http://dr15.sdss.org/infrared/spectrum/view/stars?location_id='+apstar[4]+'&commiss='+dict.commiss+'&apogee_id='+dict.apogee_id+'&action=search" target="_blank">Interactive Spectrum</a></td>');
			output += ('<td><a href="http://dr15.sdss.org/sas/dr15/'+apstar[0]+'/spectro/redux/r8/stars/'+apstar[1]+'/'+apstar[4]+'/apStar-r8-'+apstar[5].replace("+","%2b")+'.fits">Download FITS</a></td></tr></table>');
			output += '<h4>Targeting Information</h4>';
			output += '<table class="table-bordered table-responsive"><tr><th>2MASS j</th><th>2MASS h</th><th>2MASS k</th><th>j_err</th><th>h_err</th><th>k_err</th></tr>';
			output += ('<tr><td>'+dict.j+'</td><td>'+dict.h+'</td><td>'+dict.k+'</td><td>'+dict.j_err+'</td><td>'+dict.h_err+'</td><td>'+dict.k_err+'</td></tr></table>');
			output += '<table class="table-bordered table-responsive"><tr><th>4.5 micron magnitude</th><th>4.5 micron magnitude error</th><th>4.5 micron magnitude source</th></tr>';
			output += ('<tr><td>'+dict.irac_4_5+'</td><td>'+dict.irac_4_5_err+'</td><td>'+dict.src_4_5+'</td></tr></table>');
			output += ('<table class="table-bordered table-responsive"><tr><th>APOGEE target flags 1</th><td>'+dict.target1+'</td></tr>');
			output += ('<tr><th>APOGEE target flags 2</th><td>'+dict.target2+'</td></tr></table>');
			
			output += '<h4>Stellar Parameters</h4>';
			output += '<table class="table-bordered table-responsive"><tr><th>Avg v<sub>helio</sub> (km/s)</th><th>Scatter in v<sub>helio</sub> (km/s)</th><th>Best-fit temperature (K)</th><th>Temp error</th></tr>';
			output += ('<tr><td>'+dict.vhelio_avg+'</td><td>'+dict.vscatter+'</td><td>'+dict.teff+'</td><td>'+dict.teff_err+'</td></tr></table');
			output += '<table class="table-bordered table-responsive"><tr><th>Surface Gravity log<sub>10</sub>(g)</th><th>log(g) error</th><th>Metallicity [Fe/H]</th><th>Metal error</th><th>[&alpha;/Fe]</th><th>[&alpha;/Fe] error</th></tr>';
			output += ('<tr><td>'+dict.logg+'</td><td>'+dict.logg_err+'</td><td>'+dict.fe_h+'</td><td>'+dict.fe_h_err+'</td><td>'+dict.alpha_m+'</td><td>'+dict.alpha_m_err+'</td></tr></table>');
			output += ('<table class="table-bordered table-responsive"><tr><th>Star flags</th><td>'+dict.starflag+'</td></tr>');
			output += ('<tr><th>Processing flags (ASPCAP)</th><td>'+dict.ascapflag+'</td></tr></table>');
			return output;
		},
		
		formatManga: function(dict) {
			var PlateIFU = (dict.plateIFU).split("-");
			var imLink = '"https://dr15.sdss.org/sas/dr15/manga/spectro/redux/v2_4_3/'+PlateIFU[0]+'/stack/images/'+PlateIFU[1]+'.png"';
			var LINLink = '"http://data.sdss.org/sas/dr15/manga/spectro/redux/v2_4_3/'+PlateIFU[0]+'/stack/manga-'+dict.plateIFU+'-LINCUBE.fits.gz"';
			var LOGLink = '"http://data.sdss.org/sas/dr15/manga/spectro/redux/v2_4_3/'+PlateIFU[0]+'/stack/manga-'+dict.plateIFU+'-LOGCUBE.fits.gz"';
			var ExpLink = '"http://sas.sdss.org/marvin/galaxy/'+dict.plateIFU+'"';
			var output = '<div><table class="table-responsive"><tr><td><a href='+imLink+' target="_blank">View Larger</a></td>';
			output += ('<td><a href='+LINLink+'>LIN Data Cube</a></td>');
			output += ('<td><a href='+LOGLink+'>LOG Data Cube</a></td>');
			output += ('<td><a href='+ExpLink+' target="_blank">Explore in Marvin</a></td></tr></table></div>');
			output += ('<img style="-webkit-user-select: none;" src='+imLink+' width="150" height="150" class="left">');
			output += '<div class="manga-table"><table class="table-bordered table-responsive"><tr><th>plateIFU</th><th>mangaid</th><th>objra</th><th>objdec</th><th>ifura</th><th>ifudec</th></tr>';
			output += ('<tr><td>'+dict.plateIFU+'</td><td>'+dict.mangaid+'</td><td>'+dict.objra+'</td><td>'+dict.objdec+'</td><td>'+dict.ifura+'</td><td>'+dict.ifudec+'</td></tr></table>');
			output += '<table class="table-bordered table-responsive"><tr><th>drp3qual</th><th>bluesn2</th><th>redsn2</th><th>mjdmax</th><th>mngtarg1</th><th>mngtarg2</th><th>mngtarg3</th></tr>';
			output += ('<tr><td>'+dict.drp3qual+'</td><td>'+dict.bluesn2+'</td><td>'+dict.redsn2+'</td><td>'+dict.mjdmax+'</td><td>'+dict.mngtarg1+'</td><td>'+dict.mngtarg2+'</td><td>'+dict.mngtarg3+'</td></tr></table></div>');
			return output;
		},
		formatSpectra: function(dict, countDict) {
			var output = '<strong>SpecObjID</strong> = ' + dict.specObjID +'<br>';
			output += ('<div><a href="http://skyserver.sdss.org/dr15/en/get/SpecById.ashx?id='+dict.specObjID+'" target="_blank">View Larger</a></div>');
			output += ('<img style="-webkit-user-select: none;" src="http://skyserver.sdss.org/dr15/en/get/SpecById.ashx?id='+dict.specObjID+'" width="400" height="400" class="left">');
			output += ('<div class="spectra-table"><table class="table-bordered table-responsive"><tr><th>Spectrograph</th><td>'+dict.instrument+'</td></tr><tr><th>class</th><td>'+dict.CLASS+'</td></tr><tr><th>Redshift (z)</th><td>'+dict.z+'</td></tr>');
			output += ('<tr><th>Redshift error</th><td>'+dict.zErr+'</td></tr><tr><th>Redshift flags</th><td>'+dict.WARNING+'</td></tr><tr><th>survey</th><td>'+dict.survey+'</td></tr><tr><th>programname</th><td>'+dict.programname+'</td></tr><tr><th>primary</th><td>'+dict.sciencePrimary+'</td></tr>');
			output += ('<tr><th>Other spec</th><td>'+(parseInt(countDict.count)-1).toString()+'</td></tr><tr><th>sourcetype</th><td>'+dict.sourceType+'</td></tr><tr><th>Velocity dispersion (km/s)</th><td>'+dict.velDisp+'</td></tr><tr><th>veldisp_error</th><td>'+dict.velDispErr+'</td></tr>');
			output += ('<tr><th>targeting_flags</th><td>'+dict.targetOne+'</td></tr><tr><th>plate</th><td>'+dict.plate+'</td></tr><tr><th>mjd</th><td>'+dict.mjd+'</td></tr><tr><th>fiberid</th><td>'+dict.fiberID+'</td></tr></table></div>');
			return output;
		},
		
		formatWISE: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr><th>Catalog</th><th>w1mag</th><th>w2mag</th><th>w3mag</th><th>w4mag</th><th>Full WISE data</th></tr>';
			output += ('<tr><td>WISE</td><td>'+dict.w1mag+'</td><td>'+dict.w2mag+'</td><td>'+dict.w3mag+'</td><td>'+dict.w4mag+'</td><td><a href="http://skyserver.sdss.org/dr15/en/tools/explore/DisplayResults.aspx?id='+dict.OBJID+'&name=wiseLinkCrossId" target="_blank">Link</a></td></tr></table>');
			return output;
		},
		
		formatTwoMASS: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr><th>Catalog</th><th>J</th><th>H</th><th>K_s</th><th>phQual</th></tr>';
			output += ('<tr><td>TwoMASS</td><td>'+dict.j+'</td><td>'+dict.h+'</td><td>'+dict.k+'</td><td>'+dict.phQual+'</td></tr></table>');
			return output;
		},
		
		formatRC3: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr><th>Catalog</th><th>Hubble type</th><th>21 cm magnitude</th><th>Neutral Hydrogen Index</th></tr>';
			output += ('<tr><td>RC3</td><td>'+dict.HUBBLE+'</td><td>'+dict.M21+' &#177; '+dict.M21ERR+'</td><td>'+dict.HI+'</td></tr></table>');
			return output;
		},
		
		formatROSAT: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr><th>Catalog</th><th>cps</th><th>hr1</th><th>hr2</th><th>ext</th></tr>';
			output += ('<tr><td>ROSAT</td><td>'+dict.CPS+'</td><td>'+dict.HR1+'</td><td>'+dict.HR2+'</td><td>'+dict.EXT+'</td></tr></table>');
			return output;
		},
		
		formatFIRST: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr><th>Catalog</th><th>Peak Flux (mJy)</th><th>Major axis (arcsec)</th><th>Minor axis (arcsec)</th></tr>';
			output += ('<tr><td>FIRST</td><td>'+dict.peak+' &#177; '+dict.rms+'</td><td>'+dict.major+'</td><td>'+dict.minor+'</td></tr></table>');
			return output;
		},
		
		formatUSNO: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr><th>Catalog</th><th>Proper Motion (mas/yr)</th><th>PM angle (deg E)</th></tr>';
			var pm = (parseFloat(dict.PROPERMOTION)*10.0).toFixed(2).toString();
			output += ('<tr><td>USNO</td><td>'+pm+' &#177; '+dict.MURAERR+'</td><td>'+dict.ANGLE+'</td></tr></table>');
			return output;
		},
		
		convertDict: function(data) {
			var output = '{';
			var lines = data.split('\n');
			var header = lines[0].split(',');
			var items = lines[1].split(',');
			for(var i = 0; i < items.length; i++) {
				if(!items[i].startsWith('"')) {
					output += ('"' + header[i] + '":"' + items[i] + '"');
				} else {
					output += ('"' + header[i] + '":' + items[i]);
				}
				if(i !== items.length - 1) {
					output += ',';
				} else {
				output += '}';
				}
			}
			return JSON.parse(output);
		},
		
		formatLineOne: function(dict) {
		    var output = '<table class="table-bordered table-responsive"><tr>';
		    output += '<th>Type</th><th>run</th><th>rerun</th><th>camcol</th><th>field</th><th>obj</th><th>SDSS Objid</th></tr>';
			output += ('<tr><td>' +dict.Type+'</td><td>'+dict.run+'</td><td>'+dict.rerun+'</td><td>'+dict.camcol+'</td><td>'+dict.field+'</td><td>'+dict.obj+'</td><td>'+dict.objID+'</td></tr>');
			output += '</table>';
			return output;
		},
		
		formatLineTwo: function(dict) {
			var output = '<table class="table-bordered table-responsive"><tr>';
			output += '<th colspan="2">RA, Dec</th><th colspan="2">Galactic Coordinates (l, b)</th></tr>';
			output += '<tr><th>Decimal</th><th>Sexagesimal</th><th>l</th><th>b</th></tr>';
			output += '<tr><td>'+dict.ra+', '+dict.dec+'</td><td>'+explore.raToSexagesimal(parseFloat(dict.ra))+', '+explore.decToSexagesimal(parseFloat(dict.dec))+'</td><td>'+dict.l+'</td><td>'+dict.b+'</td></tr>';
			output += '</table>';
			return output;
			
		},
		
		formatImaging: function(dict, binFlags) {
			var output = '<table class="table-bordered table-responsive"><tr><th><a href="https://www.sdss.org/dr15/algorithms/photo_flags_recommend/" target="_blank">Flags</a></th><td>' + explore.generateFlags(binFlags) + '</td></tr></table>';
			output += ('<img style="-webkit-user-select: none;" src="http://skyserver.sdss.org/dr15/SkyServerWS/ImgCutout/getjpeg?TaskName=Skyserver.Explore.Image&ra='+dict.ra+'&dec='+dict.dec+'&scale=0.2&width=256&height=256&opt=G" width="256" height="256" class="left">');
			output += '<div class="im-table"><table class="table-bordered table-responsive"><tr><th colspan="5" style="text-align:center">Magnitudes</th></tr><tr><td>u</td><td>g</td><td>r</td><td>i</td><td>z</td></tr>';
			output += ('<tr><td>'+dict.u+'</td><td>'+dict.g+'</td><td>'+dict.r+'</td><td>'+dict.i+'</td><td>'+dict.pz+'</td></tr></table>');
			output += '<table class="table-bordered table-responsive"><tr><th colspan="5" style="text-align:center">Magnitude Uncertainties</th></tr><tr><td>err_u</td><td>err_g</td><td>err_r</td><td>err_i</td><td>err_z</td></tr>';
			output += ('<tr><td>'+dict.err_u+'</td><td>'+dict.err_g+'</td><td>'+dict.err_r+'</td><td>'+dict.err_i+'</td><td>'+dict.err_z+'</td></tr></table></div>');
			output += ('<br><a target="_blank" href="http://skyserver.sdss.org/dr15/en/tools/chart/navi.aspx?'+'ra='+dict.ra+'&dec='+dict.dec+'&scale=0.2&width=256&height=256">View in Navigation Tool</a>');
			output += '<br><table class="table-bordered table-responsive"><tr><td>Image MJD</td><td>mode</td><td>parentID</td><td>nChild</td><td>extinction_r</td><td>PetroRad_r (arcsec)</td></tr>';
			output += ('<tr><td>'+dict.ImageMJD+'</td><td>'+dict.Mode+'</td><td>'+dict.parentID+'</td><td>'+dict.nChild+'</td><td>'+dict.extinction_r+'</td><td>'+dict.petroRad_r+' &#177; '+dict.petroRadErr_r+'</td></tr></table>');
			output += '<table class="table-bordered table-responsive"><tr><td>Mjd-Date</td><td>photoZ (KD-tree method)</td><td>Galaxy Zoo 1 morphology</td></tr>';
			var spiral = parseInt(dict.Zoo1Morphology_spiral);
			var elliptical = parseInt(dict.Zoo1Morphology_elliptical);
			var display = "Uncertain";
			if(spiral === 1 || spiral > elliptical) {
				display = "Spiral";
			} else if(elliptical === 1 || elliptical > spiral) {
				display = "Elliptical";
			}
			var dates = dict.ImageMJDString.split(" ");
			output += ('<tr><td>'+dates[0]+'</td><td>'+dict.Photoz+' &#177; '+dict.Photoz_err+'</td><td>'+display+'</td></tr></table>');
			return output;
		},
		
		generateFlags: function(binFlags) {
			var flags = {'CANONICAL_CENTER': '0',
			'BRIGHT': '1',
			'EDGE': '2',
			'BLENDED': '3',
			'CHILD': '4',
			'PEAKCENTER': '5',
			'NODEBLEND': '6',
			'NOPROFILE': '7',
			'NOPETRO': '8',
			'MANYPETRO': '9',
			'NOPETRO_BIG': '10',
			'DEBLEND_TOO_MANY_PEAKS': '11',
			'COSMIC_RAY': '12',
			'MANYR50': '13',
			'MANYR90': '14',
			'BAD_RADIAL': '15',
			'INCOMPLETE_PROFILE': '16',
			'INTERP': '17',
			'SATUR': '18',
			'NOTCHECKED': '19',
			'SUBTRACTED': '20',
			'NOSTOKES': '21',
			'BADSKY': '22',
			'PETROFAINT': '23',
			'TOO_LARGE': '24',
			'DEBLENDED_AS_PSF': '25',
			'DEBLEND_PRUNED': '26',
			'ELLIPFAINT': '27',
			'BINNED1': '28',
			'BINNED2': '29',
			'BINNED4': '30',
			'MOVED': '31',
			'DEBLENDED_AS_MOVING': '32',
			'NODEBLEND_MOVING': '33',
			'TOO_FEW_DETECTIONS': '34',
			'BAD_MOVING_FIT': '35',
			'STATIONARY': '36',
			'PEAKS_TOO_CLOSE': '37',
			'BINNED_CENTER': '38',
			'LOCAL_EDGE': '39',
			'BAD_COUNTS_ERROR': '40',
			'BAD_MOVING_FIT_CHILD': '41',
			'DEBLEND_UNASSIGNED_FLUX': '42',
			'SATUR_CENTER': '43',
			'INTERP_CENTER': '44',
			'DEBLENDED_AT_EDGE': '45',
			'DEBLEND_NOPEAK': '46',
			'PSF_FLUX_INTERP': '47',
			'TOO_FEW_GOOD_DETECTIONS': '48',
			'CENTER_OFF_AIMAGE': '49',
			'DEBLEND_DEGENERATE': '50',
			'BRIGHTEST_GALAXY_CHILD': '51',
			'CANONICAL_BAND': '52',
			'AMOMENT_UNWEIGHTED': '53',
			'AMOMENT_SHIFT': '54',
			'AMOMENT_MAXITER': '55',
			'MAYBE_CR': '56',
			'MAYBE_EGHOST': '57',
			'NOTCHECKED_CENTER': '58',
			'HAS_SATUR_DN': '59',
			'DEBLEND_PEEPHOLE': '60'};
			var toReturn = "";
			for(var key in flags) {
				var value = binFlags.charAt(binFlags.length - (parseInt(flags[key]) + 1));
				if(value === "1") {
					toReturn += (key + " ");
				}
			}
			return toReturn;
		},
		
		toBin: function(dict) {
			var str_num = dict.flags;
			$.ajax({
				type: 'GET',
				url: $('#ex-container').data('ex-webroot') + '/convert.php',
				data:{'input': str_num},
				success: function (data) {
					explore.displayImaging(dict, data, true);
				}
			});
		},
		
		decToSexagesimal: function(num) {
			var prepend = "+";
			if(num < 0) {
				prepend = "-";
				num *= -1;
			}
			var hours = Math.trunc(num);
			var minutes = Math.trunc((num-hours) * 60);
			var seconds = parseFloat(Math.round(((num - hours) * 60 - minutes) * 60 * 100) / 100).toFixed(2);
			return (prepend + hours.toString() + ":" + minutes.toString() + ":" + seconds.toString());
		},
		
		raToSexagesimal: function(num) {
			var prepend = "";
			if(num < 0) {
				prepend = "-";
				num *= -1;
			}
			var hours = Math.trunc(num / 15);
			var minutes = Math.trunc((num / 15 - hours) * 60);
			var seconds = parseFloat(Math.round(((num / 15 - hours) * 60 - minutes) * 60 * 100) / 100).toFixed(2);
			return (prepend + hours.toString() + ":" + minutes.toString() + ":" + seconds.toString());
		},
		
		updateHour: function() {
			if((((explore.queriesFinished.data && explore.queriesFinished.imaging) && (explore.queriesFinished.USNO && explore.queriesFinished.FIRST)) && ((explore.queriesFinished.ROSAT && explore.queriesFinished.RC3) && (explore.queriesFinished.TwoMASS && explore.queriesFinished.WISE))) && (explore.queriesFinished.spectra && explore.queriesFinished.manga) && (explore.queriesFinished.apogee && explore.queriesFinished.visits)) {
				$("#ex-hour").prop("style", "display: none;");
			}
		},
		
		resetData: function() {
			$("#ex-data").html = "";
			$("#ex-imaging").html = "";
			$("#ex-cross-USNO").html = "";
			$("#ex-cross-FIRST").html = "";
			$("#ex-cross-ROSAT").html = "";
			$("#ex-cross-RC3").html = "";
			$("#ex-cross-TwoMASS").html = "";
			$("#ex-cross-WISE").html = "";
			$("#ex-spectra").html = "";
			$("#ex-manga").html = "";
			$("#ex-apogee").html = "";
			$("#ex-visits").html = "";
		}
	};

	$(document).ready( function(  ) {
		explore.init();
	} );
	
})(jQuery);