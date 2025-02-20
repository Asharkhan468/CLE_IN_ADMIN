"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

interface CardProps {
  imageUrl: string;
  title: string;
  price: string;
  time: string;
  status: string;
  date: string;
  dotsIcon: string;
  editIcon: string;
  deleteIcon: string;
}

const JobCard: React.FC<CardProps> = ({
  imageUrl,
  title,
  price,
  time,
  status,
  date,
  dotsIcon,
  editIcon,
  deleteIcon,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const path = usePathname();
  console.log(path);

  const handleClose = () => setIsVisible(false);
  const handleOpen = () => setIsVisible(true);

  const [showOptions, setShowOptions] = useState(false);
  const [editDelete, SetEditDelete] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(false);

  const bookingData = {
    name: "John Doe",
    date: "September 18, 2024",
    bookingTime: "2:00 pm to 4:00 pm",
    imageUrl: "/assets/bookingsIcon/room.svg",
    title: "We clean room with 100% efforts and dedication",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, ipsam nihil? Accusantium vitae quam quod quis sint, soluta molestias tempore, facere earum atque nulla, nihil voluptatibus magni excepturi! Unde, ducimus.",
    price: 30,
    customerDetails: {
      email: "johndoe@example.com",
      phone: "+123 456 7890",
      address: "123 Main St, City, Country",
    },
  };

  const vatPercentage = 12;
  const vatAmount = (bookingData.price * vatPercentage) / 100;
  const totalAmount = bookingData.price + vatAmount;

  return (
    <>
      <div onClick={handleOpen} className="cursor-pointer">
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden p-4 w-80 z-10 hover:scale-100 hover:shadow-lg">
          <Image
            src={imageUrl}
            alt={title}
            width={200}
            height={100}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-md font-semibold text-[#00BFFF]">{price}</h2>

              <Image
                src={dotsIcon}
                alt="options"
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowOptions(!showOptions);
                }}
              />

              {showOptions && (
                <div className="w-36 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                  <button
                    className="flex items-center w-full p-2 hover:bg-gray-100"
                    onClick={() => {
                      console.log("Edit clicked");
                      setShowOptions(false);
                    }}
                  >
                    <Image
                      src={editIcon}
                      alt="Edit"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span>Edit</span>
                  </button>
                  <button
                    className="flex items-center w-full p-2 hover:bg-gray-100"
                    onClick={() => {
                      console.log("Delete clicked");
                      setShowOptions(false);
                    }}
                  >
                    <Image
                      src={deleteIcon}
                      alt="Delete"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

            <h2 className="text-md font-semibold text-gray-800">{title}</h2>
            <h2 className="text-sm text-gray-800">{time}</h2>
            <h2 className="text-sm text-gray-800">Status: {status}</h2>
            <h2 className="text-sm text-gray-800">Date: {date}</h2>
          </div>
        </div>
      </div>

      {isVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="w-full max-w-4xl sm:max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6 relative max-h-[95vh] overflow-auto">
            <div className="flex justify-end">
              <button onClick={handleClose}>
                <Image
                  src="/assets/bookingsIcon/closeIcon.svg"
                  alt="Close"
                  width={16}
                  height={16}
                />
              </button>
            </div>

            <div className="space-y-4 z-10 relative">
              <div className="flex justify-center items-center mt-5 w-full">
                <div className="w-full max-w-xl">
                  <Image
                    src={bookingData.imageUrl}
                    alt="Room Image"
                    width={300}
                    height={100}
                    className="w-full h-[200px] object-cover rounded-md shadow-lg"
                  />
                </div>
              </div>

              <h3 className="text-gray-600 text-sm sm:text-lg font-semibold">
                {bookingData.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {bookingData.description}
              </p>

              <div className="max-w-full w-full bg-white  rounded-lg p-1 mt-4 ">
                {/* Price */}
                <div className="flex justify-between items-center py-2 ">
                  <span className="text-gray-600">Price</span>
                  <span className="text-gray-800 font-medium">€ 200/hr</span>
                </div>
              </div>

              <div>
                <p className="text-lg mt-8">Availablity</p>

                <div className="flex justify-start gap-12">
                  <div className="mt-3">
                    <p className="text-sm font-semibold">Monday</p>
                    <p className="text-sm text-[#00BFFF]">8:00 AM to 22:00</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-semibold">Tuesday</p>
                    <p className="text-sm text-[#00BFFF]">8:00 AM to 22:00</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-semibold">Wednesday</p>
                    <p className="text-sm text-[#00BFFF]">8:00 AM to 22:00</p>
                  </div>
                </div>
              </div>

              <div className="grid w-full items-center gap-1.5 mt-6">
                <p className="text-lg mt-2">Location</p>

                <Image
                  className="mt-4 w-full h-[180px] object-cover"
                  src="/assets/bookingsIcon/map.svg"
                  alt="map"
                  width={1000}
                  height={500}
                />
              </div>

              <div
                onClick={() => {
                  setCustomerInfo(!customerInfo);
                }}
                className="flex items-center mt-6"
              >
                {/* Info Button */}
                <button
                  className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Customer Info"
                >
                  <span className="text-xl font-bold">i</span>
                </button>
                {/* Info Text */}
                <p className="ml-2 text-gray-700 cursor-pointer text-sm font-medium hover:text-blue-600 transition-all duration-300">
                  Service Provider info
                </p>
              </div>

              {customerInfo && (
                <div className="max-w-full w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
                  <div className="px-6 py-4 border-b bg-[#00BFFF] text-white">
                    <h2 className="text-lg font-bold">Customer Information</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-500">
                        Full Name
                      </h3>
                      <p className="text-gray-700">Kam David</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-500">
                        Phone No
                      </h3>
                      <p className="text-gray-700">0987654321</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-500">
                        Email Address
                      </h3>
                      <p className="text-gray-700">kamdavid@gmail.com</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-500">
                        Date of Birth
                      </h3>
                      <p className="text-gray-700">11/07/2024</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-500">
                        Gender
                      </h3>
                      <p className="text-gray-700">Male</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-500">
                        Address
                      </h3>
                      <p className="text-gray-700">
                        3.W estern Avenue, New York, USA
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* </div> */}

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Reviews
                </h4>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl shadow-md transition duration-300 hover:shadow-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                        <Image
                          src="/assets/servicesIcons/profile2.svg"
                          alt="Alex Smith"
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Alex Smith</p>
                        <div className="flex items-center text-yellow-400 text-xs">
                          ★★★★☆
                          <span className="text-gray-500 ml-2">
                            (4.5 Stars)
                          </span>
                        </div>
                      </div>

                      <div className="ml-auto relative">
                        <button
                          onClick={() => SetEditDelete(!editDelete)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <FontAwesomeIcon icon={faEllipsisV} size="lg" />
                        </button>

                        {editDelete && (
                          <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                            <button
                              className="flex items-center w-full p-2 hover:bg-gray-100"
                              onClick={() => {
                                console.log("Edit clicked");
                                SetEditDelete(false);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="w-4 h-4 mr-2"
                              />
                              <span>Edit</span>
                            </button>
                            <button
                              className="flex items-center w-full p-2 hover:bg-gray-100"
                              onClick={() => {
                                console.log("Delete clicked");
                                SetEditDelete(false);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="w-4 h-4 mr-2"
                              />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      "Very happy with the cleaning. Will definitely book
                      again!"
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex mt-6 justify-center">
                <button className="px-6 py-2 border-2 w-[250px] rounded-md max-w-xs border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-white transition mt-3">
                  Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobCard;
