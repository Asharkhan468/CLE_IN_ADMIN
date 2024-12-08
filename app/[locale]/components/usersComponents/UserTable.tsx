"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useTranslations} from 'next-intl';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  faEllipsisV,
  faEdit,
  faTrashAlt,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

interface Invoice {
  Name: string;
  email: string;
  PhoneNo: string;
  role: string;
  address: string;
  gender: string;
  dateBirth: string;
}

const invoices: Invoice[] = [
  {
    Name: "John Doe",
    email: "john.doe@example.com",
    PhoneNo: "(123) 456-7890",
    role: "User",
    address: "123 Main St, Springfield",
    gender: "Male",
    dateBirth: "1985-01-15",
  },
  {
    Name: "Jane Smith",
    email: "jane.smith@example.com",
    PhoneNo: "(987) 654-3210",
    role: "Provider",
    address: "456 Oak St, Metropolis",
    gender: "Female",
    dateBirth: "1990-06-23",
  },
  {
    Name: "Jane Smith",
    email: "jane.smith@example.com",
    PhoneNo: "(987) 654-3210",
    role: "User",
    address: "456 Oak St, Metropolis",
    gender: "Female",
    dateBirth: "1990-06-23",
  },
  {
    Name: "Jane Smith",
    email: "jane.smith@example.com",
    PhoneNo: "(987) 654-3210",
    role: "Provider",
    address: "456 Oak St, Metropolis",
    gender: "Female",
    dateBirth: "1990-06-23",
  },
  {
    Name: "Jane Smith",
    email: "jane.smith@example.com",
    PhoneNo: "(987) 654-3210",
    role: "User",
    address: "456 Oak St, Metropolis",
    gender: "Female",
    dateBirth: "1990-06-23",
  },
  {
    Name: "Jane Smith",
    email: "jane.smith@example.com",
    PhoneNo: "(987) 654-3210",
    role: "Provider",
    address: "456 Oak St, Metropolis",
    gender: "Female",
    dateBirth: "1990-06-23",
  },
  {
    Name: "Jane Smith",
    email: "jane.smith@example.com",
    PhoneNo: "(987) 654-3210",
    role: "User",
    address: "456 Oak St, Metropolis",
    gender: "Female",
    dateBirth: "1990-06-23",
  },
  {
    Name: "Jane Smith",
    email: "jane.smith@example.com",
    PhoneNo: "(987) 654-3210",
    role: "User",
    address: "456 Oak St, Metropolis",
    gender: "Female",
    dateBirth: "1990-06-23",
  },
  
 
 
  
];

export function TableDemo() {
  const t = useTranslations('Users');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [openEditDelete, setOpenEditDelete] = useState<number | null>(null);

  const handleToggleMoreInfo = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (openEditDelete !== null) {
      setOpenEditDelete(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openEditDelete]);

  return (
    <div className="w-full max-h-screen px-4 sm:px-8">
    <div className="overflow-hidden rounded-lg shadow-lg w-full mt-4">
      <Table className="table-auto w-full divide-y divide-gray-200">
        <TableHeader>
          <TableRow className="bg-gray-200">
            {[
              "name",
              "email",
              "phoneNo",
              "role",
              "address",
              "gender",
              "dateOfBirth",
              "actions",
            ].map((header, idx) => (
              <TableHead
                key={idx}
                className={`px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 ${
                  header === "actions"
                    ? "text-center"
                    : idx > 1
                    ? "hidden md:table-cell"
                    : ""
                }`}
              >
                {t(header)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
  
        <TableBody className="divide-y divide-gray-200">
          {invoices.map((invoice, index) => (
            <React.Fragment key={index}>
              <TableRow className="hover:bg-gray-50 transition duration-300 ease-in-out">
                {[
                  invoice.Name,
                  invoice.email,
                  invoice.PhoneNo,
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-[#00BFFF]">
                    {invoice.role}
                  </span>,
                  invoice.address,
                  invoice.gender,
                  invoice.dateBirth,
                ].map((value, idx) => (
                  <TableCell
                    key={idx}
                    className={`px-4 py-3 text-sm text-gray-600 ${
                      idx > 1 && idx < 7 ? "hidden md:table-cell" : ""
                    }`}
                  >
                    {value}
                  </TableCell>
                ))}
  
                <TableCell className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {/* "More Info" Button (Visible only on small screens) */}
                    <button
                      className="md:hidden text-[#00BFFF] hover:text-[#00BFFF] transition flex items-center"
                      onClick={() => handleToggleMoreInfo(index)}
                    >
                      <FontAwesomeIcon
                        icon={
                          expandedRow === index ? faChevronUp : faChevronDown
                        }
                        className="w-5 h-5"
                      />
                     
                    </button>
  
                    {/* Action Menu Button */}
                    <button
                      className="text-gray-400 hover:text-gray-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenEditDelete(
                          openEditDelete === index ? null : index
                        );
                      }}
                    >
                      <FontAwesomeIcon icon={faEllipsisV} className="w-5 h-5" />
                    </button>
                  </div>
  
                  {/* Action Menu (Edit/Delete) */}
                  {openEditDelete === index && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10 border border-gray-100">
                      <button
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Edit clicked");
                          setOpenEditDelete(null);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4 mr-2" />
                        {t("edit")}
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Delete clicked");
                          setOpenEditDelete(null);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4 mr-2" />
                        {t("delete")}
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
  
              {/* Expanded Row for More Info (Small Screens Only) */}
              {expandedRow === index && (
                <TableRow className="md:hidden">
                  <TableCell colSpan={8} className="px-6 py-4 bg-gray-50">
                    <div className="space-y-3 text-sm">
                      {[
                        ["phone", invoice.PhoneNo],
                        ["role", invoice.role],
                        ["address", invoice.address],
                        ["gender", invoice.gender],
                        ["dateOfBirth", invoice.dateBirth],
                      ].map(([label, value], idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center border-b border-gray-200 pb-2"
                        >
                          <span className="font-medium text-gray-600">
                            {t(label)}:
                          </span>
                          <span className="text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
  
  
  );
}