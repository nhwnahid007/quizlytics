import { SectionTitleMinimal } from "@/components/Shared/SectionTitle";
import Image from "next/image";
import React from "react";
import { FaFacebook, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const ServicesPage = () => {
  return (
    <div className="mb-5 min-h-screen">
      <section className="relative  bg-gray-100 py-10 ">
        <div className="container pt-5 mx-auto">

          <SectionTitleMinimal  heading={" Meet Our Team"} subHeading={" We are a passionate and dedicated team committed to deliveringtop-notch solutions."}></SectionTitleMinimal>
          

          <div className=" max-w-4xl  mx-auto p-4 py-5  bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
  {/* Team Member 1 */}
            <div className="flex">
            <div className=" max-w-xs text-center mx-auto">
              <div className="relative group">
                <Image
                  className="object-cover object-center w-[125px] h-[125px] mx-auto rounded-full"
                  src="https://i.ibb.co.com/4jQKHbZ/myself-1.png"
                  alt="Nahid"
                  width={300}
                  height={300}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-4 pt-12">
                    <a
                      href=" https://github.com/nhwnahid007"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaGithub size={16} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/nhwnahid"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaLinkedin size={16} />
                    </a>
                    <a
                      href=" https://www.facebook.com/nhwnahid"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaFacebook size={16} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <h3 className=" font-bold text-primary-color">
                  Nahidul Islam
                </h3>
                <span className="mt-1  dark:text-gray-300">
                  Team Leader
                </span>
              </div>
            </div>
            </div>
          
        
<div className="flex flex-col lg:flex-row">
  
            {/* Team Member 2 */}
            <div className="max-w-xs text-center mx-auto relative mb-3">
              <div className="relative group">
                <Image
                  className="object-cover object-center w-[125px] h-[125px] mx-auto rounded-full"
                  src="https://i.ibb.co.com/g95Gd68/photo-2024-07-06-13-14-23.jpg"
                  alt="Musa Akram Saleh"
                  width={300}
                  height={300}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-4 pt-12">
                    <a
                      href="https://github.com/musaakramsaleh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaGithub size={16} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/musa-akram-saleh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaLinkedin size={16} />
                    </a>
                    <a
                      href="https://www.facebook.com/profile.php?id=100050096121271"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaFacebook size={16} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-bold text-primary-color">Musa Akram</h3>
                <span className="mt-1 dark:text-gray-300">Team Member</span>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="max-w-xs text-center mx-auto relative mb-3">
              <div className="relative group">
                <Image
                  className="object-cover object-center w-[125px] h-[125px] mx-auto rounded-full"
                  src="https://i.ibb.co.com/0Bfm4Wh/rzb4.jpg"
                  alt="Rafiul"
                  width={300}
                  height={300}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-4 pt-12">
                    <a
                      href="https://github.com/rafiul-razib"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaGithub size={16} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/rafiul-habib"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaLinkedin size={16} />
                    </a>
                    <a
                      href="https://www.facebook.com/rafiul.razib?_rdc=1&_rdr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaFacebook size={16} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-bold text-primary-color">Rafiul Habib</h3>
                <span className="mt-1  dark:text-gray-300">
                  Team Member
                </span>
              </div>
            </div>
</div>
           <div className="flex flex-col lg:flex-row ">
             {/* Team Member 4 */}
             <div className="max-w-xs text-center mx-auto relative">
              <div className="relative group">
                <Image
                  className="object-cover object-center w-[125px] h-[125px] mx-auto rounded-full"
                  src="https://i.ibb.co.com/1RSt7QY/Sa-Rana02.jpg"
                  alt="Sayed Rana"
                  width={300}
                  height={300}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-4 pt-12">
                    <a
                      href="https://github.com/msahrana"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaGithub size={16} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/md-sayed-anower-hossain"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaLinkedin size={16} />
                    </a>
                    <a
                      href="https://www.facebook.com/msahrana"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaFacebook size={16} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-bold text-primary-color">Sayed Rana</h3>
                <span className="mt-1 text-sm  dark:text-gray-300">
                  Team Member
                </span>
              </div>
            </div>

            {/* Team Member 5 */}

            <div className="max-w-xs text-center mx-auto relative">
              <div className="relative group">
                <Image
                  className="object-cover object-center w-[125px] h-[125px] mx-auto rounded-full"
                  src="https://i.ibb.co.com/jhFdWP2/IMG-20240426-031304-893.jpg"
                  alt="Musa Akram Saleh"
                  width={300}
                  height={300}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-4 pt-12">
                    <a
                      href="https://github.com/ashimsarkar1512"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaGithub size={16} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/ashim-kumar-sarker-0b22432b5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaLinkedin size={16} />
                    </a>
                    <a
                      href="https://www.facebook.com/profile.php?id=100041230431676"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      <FaFacebook size={16} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <h3 className=" font-bold text-primary-color">Ashim Sarkar</h3>
                <span className="mt-1 text-sm dark:text-gray-300">
                  Team Member
                </span>
              </div>
            </div>
           </div>
          </div>
        </div>
      </section>
    
    </div>
  );
};

export default ServicesPage;
