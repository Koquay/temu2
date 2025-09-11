export const saveStateToLocalStorage = (state: any) => {
  let temuStr = localStorage.getItem('temu');

  let temuObj;

  if (temuStr) {
    temuObj = JSON.parse(temuStr);
  } else {
    temuObj = {};
  }

  temuObj = { ...temuObj, ...state };
  localStorage.setItem('temu', JSON.stringify(temuObj));

  // console.log('saveStateToLocalStorage.temuObj', temuObj)

  temuStr = localStorage.getItem('temu');
  // console.log('temuStr after saveStateToLocalStorage.temuStr', temuStr)

};

export const getGuestCart = () => {
  let temu: any = {};
  try {
    temu = JSON.parse(localStorage.getItem('temu') || '{}');
  } catch {
    temu = {};
  }

  console.log('guestCart.temu', temu)

  return temu?.cartModel?.cart || [];
}


