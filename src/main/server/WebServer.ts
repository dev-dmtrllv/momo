import express, { Application } from "express";
import http from "http";
import { AddressInfo } from "net";

export class WebServer
{
	private static instance_: WebServer = new WebServer();

	public static get(): WebServer { return this.instance_; }

	private readonly app_: Application;
	private server_?: http.Server;
	private isRunning_: boolean = false;

	public isRunning() { return this.isRunning_; }

	private constructor()
	{
		this.app_ = express();
		this.app_.get("/", (req, res) => res.send("helloa!"))
	}

	public start()
	{
		return new Promise<[string, number]>((resolve, reject) => 
		{
			if (this.isRunning_)
			{
				reject(new Error("Server is already running!"));
			}
			else
			{
				this.isRunning_ = true;
				this.server_ = this.app_.listen(0, "127.0.0.1", () => 
				{
					const info = this.server_?.address()! as AddressInfo;
					resolve([info.address, info.port]);
				});
			}
		});
	}

	public stop()
	{
		return new Promise<void>((resolve, reject) => 
		{
			if (!this.isRunning_)
			{
				reject(new Error("Server is not running!"));
			}
			else
			{
				this.isRunning_ = false;
				this.server_?.close((err) => 
				{
					if (err)
						reject(err);
					else
						resolve();
				});
			}
		});
	}
}
