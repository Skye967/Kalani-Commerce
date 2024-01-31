"use client";
import MainLayout from "../layouts/MainLayout";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import TextInput from "../components/TextInput";
import { useRouter } from "next/navigation";
import { useUser } from "../context/user";
import { useEffect, useState } from "react";
import useIsLoading from "../hooks/useIsLoading";
import useUserAddress from "../hooks/useUserAddress";
import { toast } from "react-toastify";
import useCreateAddress from "../hooks/useCreateAddress";
import ClientOnly from "../components/ClientOnly";

function Address() {
  const router = useRouter();
  const user = useUser();

  const [addressId, setAddressId] = useState<Number | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [error, setError] = useState<{type: string, message: string}>({type: '', message: ''});

    const showError = (type: string) => {
        if (!error) {
        return ""
    }
    if (Object.entries(error).length > 0 && error?.type == type) {
      return error.message;
    }
    return "";
  };

    const getAddress = async () => {
    if (user?.id == null || user?.id == undefined) {
      useIsLoading(false);
      return;
    }

    const response:
       {
          id: Number;
          name: string;
          address: string;
          zipcode: string;
          city: string;
          country: string;
        } | {}
      = await useUserAddress();
      if (response) {
      setTheCurrentAddress(response);
      useIsLoading(false);
      return;
    }
    useIsLoading(false);
    };

  useEffect(() => {
      useIsLoading(true);
      getAddress();

      // Temorary error handling: fix useState not updating fast enough
      if (error.message != '') {
          toast.error(error.message, { autoClose: 3000 });
      }
      
  }, [user, error]);

  const setTheCurrentAddress = (result: {
    id?: any;
    name?: any;
    address?: any;
    zipcode?: any;
    city?: any;
    country?: any;
  }) => {
    setAddressId(result.id);
    setName(result.name);
    setAddress(result.address);
    setZipcode(result.zipcode);
    setCity(result.city);
    setCountry(result.country);
  };

    const validate = () => {

    setError({type: '', message: ''});
    let isError = false;

    if (!name) {
      setError({ type: "name", message: "A name is required" });
      isError = true;
    } else if (!address) {
      setError({ type: "address", message: "An address is required" });
      isError = true;
    } else if (!zipcode) {
      setError({ type: "zipcode", message: "A zipcode is required" });
      isError = true;
    } else if (!city) {
      setError({ type: "city", message: "A city is required" });
      isError = true;
    } else if (!country) {
      setError({ type: "country", message: "A country is required" });
      isError = true;
    }
      
    return isError;
  };

   const submit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
       let isError = validate();

       //Fix useState: not updating fast enough
    if (isError) {
        // toast.error(error.message, { autoClose: 3000 });
      return;
    }

    try {
      setIsUpdatingAddress(true);

      const response = await useCreateAddress({
        addressId,
        name,
        address,
        zipcode,
        city,
        country,
      });

      setTheCurrentAddress(response);
      setIsUpdatingAddress(false);

      toast.success("Address updated!", { autoClose: 3000 });

      router.push("/checkout");
    } catch (error) {
      setIsUpdatingAddress(false);
      console.log(error);
      alert(error);
    }
};

  return (
    <>
      <MainLayout>
        <div id="AddressPage" className="mt-4 max-w-[600px] mx-auto px-2">
          <div className="mx-atuo bg-white rounded-lg p-3">
            <div className="text-xl text-bold mb-2">Address Details</div>
            <form onSubmit={submit}>
              <div className="mb-4">
                <ClientOnly>
                  <TextInput
                    className="w-full"
                    string={name}
                    placeholder="Name"
                    error={showError('name')}
                    onUpdate={setName}
                  />
                </ClientOnly>
              </div>
              <div className="mb-4">
                <ClientOnly>
                  <TextInput
                    className="w-full"
                    string={address}
                    placeholder="Address"
                    error={showError("address")}
                    onUpdate={setAddress}
                  />
                </ClientOnly>
              </div>
              <div className="mb-4">
                <ClientOnly>
                  <TextInput
                    className="w-full"
                    string={zipcode}
                    placeholder="Zipcode"
                    error={showError("zipcode")}
                    onUpdate={setZipcode}
                  />
                </ClientOnly>
              </div>
              <div className="mb-4">
                <ClientOnly>
                  <TextInput
                    className="w-full"
                    string={city}
                    placeholder="City"
                    error={showError("city")}
                    onUpdate={setCity}
                  />
                </ClientOnly>
              </div>
              <div className="mb-4">
                <ClientOnly>
                  <TextInput
                    className="w-full"
                    string={country}
                    placeholder="Country"
                    error={showError("country")}
                    onUpdate={setCountry}
                  />
                </ClientOnly>
              </div>
              <button
                type="submit"
                disabled={isUpdatingAddress}
                className={`mt-6 w-full text-white text-lg font-semibold p-3 rounded ${
                  isUpdatingAddress ? "bg-blue-800" : "bg-blue-600"
                }`}
              >
                {!isUpdatingAddress ? (
                  <div>Update Address</div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <AiOutlineLoading3Quarters className="animate-spin"/>
                    Please wait...
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </MainLayout>
    </>
  );
}

export default Address;
