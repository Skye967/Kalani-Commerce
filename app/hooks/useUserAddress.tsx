

const useUserAddress = async() => {
    let address = {
      name: null,
      address: null,
      zipcode: null,
      city: null,
      country: null,
    };
    let response = await fetch('/api/address/get')

    if (response) {
        let data = await response.json();
        if (data) address = data;
    }

    return address;
}

export default useUserAddress