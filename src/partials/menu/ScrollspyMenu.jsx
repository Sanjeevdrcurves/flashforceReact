const ScrollspyMenu = ({ items, onSelect }) => {
  const buildAnchor = (item, index, indent = false) => {
    return (
      <div
        key={index}
        data-scrollspy-anchor={item.target}
        className={`cursor-pointer flex items-center rounded-lg pl-2.5 pr-2.5 py-2.5 border border-transparent text-gray-800 scrollspy-active:bg-secondary-active scrollspy-active:text-primary scrollspy-active:font-medium dark:hover:bg-coal-300 dark:hover:border-gray-100 hover:rounded-lg dark:scrollspy-active:bg-coal-300 dark:scrollspy-active:border-gray-100 ${
          indent ? 'gap-3.5' : 'gap-1.5'
        } ${item.active ? 'active' : ''} text-2sm hover:text-primary`}
        onClick={() => item.onClick && item.onClick()} // Trigger onClick
      >
        <span className="flex w-1.5 relative before:absolute start-px rtl:-start-[5px] before:top-0 before:size-1.5 before:rounded-full before:-translate-x-2/4 before:-translate-y-2/4 scrollspy-active:before:bg-primary"></span>
        {item.title}
      </div>
    );
  };

  const buildSubAnchors = (items) => {
    return items.map((item, index) => buildAnchor(item, index, true));
  };

  const renderChildren = (items) => {
    return items.map((item, index) => {
      if (item.children) {
        return (
          <div key={index} className="flex flex-col">
            <div className="ps-6 pe-2.5 py-2.5 text-2sm font-semibold text-gray-900">
              {item.title}
            </div>
            <div className="flex flex-col">{buildSubAnchors(item.children)}</div>
          </div>
        );
      } else {
        return buildAnchor(item, index);
      }
    });
  };

  return (
    <div className="flex flex-col grow relative before:absolute before:start-[11px] before:top-0 before:bottom-0 before:border-s before:border-gray-200">
      {renderChildren(items)}
    </div>
  );
};

export { ScrollspyMenu };
