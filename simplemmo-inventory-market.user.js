// ==UserScript==
// @name         SimpleMMO Inventory Market
// @namespace    https://github.com/quantumsheep/simplemmo-inventory-market
// @version      1.1
// @description  Easy market listing
// @author       QuantumSheep
// @match        https://web.simple-mmo.com/inventory/items*
// @icon         https://www.google.com/s2/favicons?domain=simple-mmo.com
// @grant        none
// ==/UserScript==

(async function () {
  const lastColumnHeader = document.querySelector('table thead th:last-child');

  lastColumnHeader.insertAdjacentHTML('beforebegin', `
<th scope="col" class="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
<a class="text-indigo-800 font-semibold hover:text-indigo-900" href="#!">
  Market Value
</a>
</th>
  `.trim());

  const items = document.querySelectorAll('tr[id^="item-"]');

  items.forEach(async (item) => {
    const id = item.id.slice(5);
    const res = await fetch(`/api/item/${id}`, {
      method: 'POST',
    }).then(res => res.json());

    const name = atob(res[0]).replace(/'/g, "\\'");
    const icon = res[1];
    const marketPrice = res[8];
    const quantity = res[9];
    const itemId = res[11];

    item.querySelector('td:last-child').insertAdjacentHTML('beforebegin', `
<td class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium dark:text-white hidden xl:table-cell">
<img src="/img/icons/I_GoldCoin.png" class="h-4 inline-block"> ${marketPrice}
</td>
  `.trim());

    const lastColumn = item.querySelector('td:last-child');
    lastColumn.classList.remove('text-right');
    lastColumn.classList.add('text-left');

    lastColumn.insertAdjacentHTML('afterbegin', `
<a onclick="if (!window.__cfRLUnblockHandlers) return false; marketSellItem(${itemId}, '${name}', '${icon}', ${quantity});" href="javascript:;">
<button type="button" class="dark:text-white relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-green-400 text-sm font-medium text-white hover:bg-green-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
  Sell
</button>
</a>
  `.trim());
  });
})();
