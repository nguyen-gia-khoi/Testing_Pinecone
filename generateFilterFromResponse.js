const generateFilterFromResponse = (responseText) => {
    const include = [];
    const exclude = [];
  
    const keywordToFilterMap = {
      'cá': { field: 'main_protein', value: 'Cá' },
      'hạt': { field: 'main_protein', value: 'Hạt' },
      'rau': { field: 'main_protein', value: 'Rau' },
      'trái cây': { field: 'main_protein', value: 'Trái cây' },
      'chiên': { field: 'preparation_method', value: 'Chiên' },
      'bánh kẹo': { field: 'preparation_method', value: 'Chế biến sẵn' },
      'rượu bia': { field: 'preparation_method', value: 'Chế biến sẵn' },
      'muối': { field: 'main_protein', value: 'Muối' }
    };
  
    const lower = responseText.toLowerCase();
  
    // Extract phần bổ sung
    const matchInclude = lower.match(/các chất cần bổ sung:(.*?)(các chất nên tránh|$)/);
    if (matchInclude) {
      const text = matchInclude[1];
      Object.entries(keywordToFilterMap).forEach(([keyword, { field, value }]) => {
        if (text.includes(keyword)) {
          include.push({ field, value });
        }
      });
    }
  
    // Extract phần tránh
    const matchExclude = lower.match(/các chất nên tránh:(.*)/);
    if (matchExclude) {
      const text = matchExclude[1];
      Object.entries(keywordToFilterMap).forEach(([keyword, { field, value }]) => {
        if (text.includes(keyword)) {
          exclude.push({ field, value });
        }
      });
    }
  
    // Build filter
    const filter = {};
  
    // include
    for (const { field, value } of include) {
      if (!filter[field]) filter[field] = { $in: [] };
      if (!filter[field].$in.includes(value)) filter[field].$in.push(value);
    }
  
    // exclude
    for (const { field, value } of exclude) {
      if (!filter[field]) filter[field] = {};
      if (!filter[field].$nin) filter[field].$nin = [];
      if (!filter[field].$nin.includes(value)) filter[field].$nin.push(value);
    }
  
    return filter;
}
export default generateFilterFromResponse;