import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import PriceRanges from '../../components/PriceRanges/PriceRanges.js';
import connectPriceRanges from '../../connectors/price-ranges/connectPriceRanges.js';
import defaultTemplates from './defaultTemplates.js';

import {
  bemHelper,
  prepareTemplateProps,
  getContainerNode,
} from '../../lib/utils.js';

const bem = bemHelper('ais-price-ranges');

const renderer = ({
  containerNode,
  templates,
  renderState,
  collapsible,
  cssClasses,
  labels,
  currency,
  autoHideContainer,
}) => ({
  refine,
  facetValues,
  instantSearchInstance: {templatesConfig},
}, isFirstRendering) => {
  if (isFirstRendering) {
    renderState.templateProps = prepareTemplateProps({
      defaultTemplates,
      templatesConfig,
      templates,
    });
    return;
  }

  const shouldAutoHideContainer = autoHideContainer && facetValues.length === 0;

  ReactDOM.render(
    <PriceRanges
      collapsible={collapsible}
      cssClasses={cssClasses}
      currency={currency}
      facetValues={facetValues}
      labels={labels}
      refine={refine}
      shouldAutoHideContainer={shouldAutoHideContainer}
      templateProps={renderState.templateProps}
    />,
    containerNode
  );
};

const usage = `Usage:
priceRanges({
  container,
  attributeName,
  [ currency=$ ],
  [ cssClasses.{root,header,body,list,item,active,link,form,label,input,currency,separator,button,footer} ],
  [ templates.{header,item,footer} ],
  [ labels.{currency,separator,button} ],
  [ autoHideContainer=true ],
  [ collapsible=false ]
})`;

/**
 * Instantiate a price ranges on a numerical facet
 * @function priceRanges
 * @param  {string|DOMElement} options.container Valid CSS Selector as a string or DOMElement
 * @param  {string} options.attributeName Name of the attribute for faceting
 * @param  {Object} [options.templates] Templates to use for the widget
 * @param  {string|Function} [options.templates.item] Item template. Template data: `from`, `to` and `currency`
 * @param  {string} [options.currency='$'] The currency to display
 * @param  {Object} [options.labels] Labels to use for the widget
 * @param  {string|Function} [options.labels.separator] Separator label, between min and max
 * @param  {string|Function} [options.labels.button] Button label
 * @param  {boolean} [options.autoHideContainer=true] Hide the container when no refinements available
 * @param  {Object} [options.cssClasses] CSS classes to add
 * @param  {string|string[]} [options.cssClasses.root] CSS class to add to the root element
 * @param  {string|string[]} [options.cssClasses.header] CSS class to add to the header element
 * @param  {string|string[]} [options.cssClasses.body] CSS class to add to the body element
 * @param  {string|string[]} [options.cssClasses.list] CSS class to add to the wrapping list element
 * @param  {string|string[]} [options.cssClasses.item] CSS class to add to each item element
 * @param  {string|string[]} [options.cssClasses.active] CSS class to add to the active item element
 * @param  {string|string[]} [options.cssClasses.link] CSS class to add to each link element
 * @param  {string|string[]} [options.cssClasses.form] CSS class to add to the form element
 * @param  {string|string[]} [options.cssClasses.label] CSS class to add to each wrapping label of the form
 * @param  {string|string[]} [options.cssClasses.input] CSS class to add to each input of the form
 * @param  {string|string[]} [options.cssClasses.currency] CSS class to add to each currency element of the form
 * @param  {string|string[]} [options.cssClasses.separator] CSS class to add to the separator of the form
 * @param  {string|string[]} [options.cssClasses.button] CSS class to add to the submit button of the form
 * @param  {string|string[]} [options.cssClasses.footer] CSS class to add to the footer element
 * @param  {object|boolean} [options.collapsible=false] Hide the widget body and footer when clicking on header
 * @param  {boolean} [options.collapsible.collapsed] Initial collapsed state of a collapsible widget
 * @return {Object} widget
 */
export default function priceRanges({
  container,
  attributeName,
  cssClasses: userCssClasses = {},
  templates = defaultTemplates,
  collapsible = false,
  labels: userLabels = {},
  currency: userCurrency = '$',
  autoHideContainer = true,
} = {}) {
  if (!container) {
    throw new Error(usage);
  }

  const containerNode = getContainerNode(container);

  const labels = {
    button: 'Go',
    separator: 'to',
    ...userLabels,
  };

  const cssClasses = {
    root: cx(bem(null), userCssClasses.root),
    header: cx(bem('header'), userCssClasses.header),
    body: cx(bem('body'), userCssClasses.body),
    list: cx(bem('list'), userCssClasses.list),
    link: cx(bem('link'), userCssClasses.link),
    item: cx(bem('item'), userCssClasses.item),
    active: cx(bem('item', 'active'), userCssClasses.active),
    form: cx(bem('form'), userCssClasses.form),
    label: cx(bem('label'), userCssClasses.label),
    input: cx(bem('input'), userCssClasses.input),
    currency: cx(bem('currency'), userCssClasses.currency),
    button: cx(bem('button'), userCssClasses.button),
    separator: cx(bem('separator'), userCssClasses.separator),
    footer: cx(bem('footer'), userCssClasses.footer),
  };

  // before we had opts.currency, you had to pass labels.currency
  const currency = userLabels.currency !== undefined
    ? userLabels.currency
    : userCurrency;

  const specializedRenderer = renderer({
    containerNode,
    templates,
    renderState: {},
    collapsible,
    cssClasses,
    labels,
    currency,
    autoHideContainer,
  });

  try {
    const makeWidget = connectPriceRanges(specializedRenderer);
    return makeWidget({attributeName});
  } catch (e) {
    throw new Error(usage);
  }
}
